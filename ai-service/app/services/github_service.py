import re
import httpx
from typing import List, Dict, Optional, Tuple
import asyncio
import os

class GitHubService:
    def __init__(self):
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        # If user provides a token, use it to avoid strict rate limits
        token = os.getenv("GITHUB_TOKEN")
        if token:
            self.headers["Authorization"] = f"token {token}"
            
        self.ignore_dirs = {
            "node_modules", ".git", "dist", "build", "coverage", ".next", 
            "venv", "__pycache__", ".idea", ".vscode", "out"
        }
        self.ignore_files = {
            "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock"
        }
        self.priority_files = {
            "readme.md", "package.json", "requirements.txt", "pyproject.toml",
            "dockerfile", "docker-compose.yml", "docker-compose.yaml",
            "app.py", "main.py", "index.js", "index.ts", "app.tsx", "main.tsx"
        }
        self.binary_exts = {
            ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp",
            ".mp4", ".mov", ".webm", ".zip", ".tar", ".gz", ".pdf", ".woff", ".woff2",
            ".eot", ".ttf", ".pyc", ".pyo", ".exe", ".dll", ".so", ".dylib"
        }

    def parse_repo_url(self, url: str) -> Tuple[Optional[str], Optional[str]]:
        """Extract owner and repo from URL."""
        # e.g., https://github.com/Anmol2627/Axon or https://github.com/Anmol2627/Axon.git
        url = url.strip()
        if url.endswith(".git"):
            url = url[:-4]
        if url.endswith("/"):
            url = url[:-1]
            
        match = re.search(r"github\.com/([^/]+)/([^/]+)$", url)
        if match:
            return match.group(1), match.group(2)
        return None, None

    async def fetch_repo_metadata(self, owner: str, repo: str) -> Dict:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"https://api.github.com/repos/{owner}/{repo}", headers=self.headers)
            if resp.status_code == 404:
                raise ValueError("Repository not found or is private.")
            if resp.status_code == 403:
                raise ValueError("GitHub API rate limit exceeded.")
            resp.raise_for_status()
            return resp.json()

    async def fetch_repo_tree(self, owner: str, repo: str, default_branch: str) -> List[Dict]:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1", 
                headers=self.headers
            )
            if resp.status_code == 403:
                raise ValueError("GitHub API rate limit exceeded.")
            resp.raise_for_status()
            data = resp.json()
            if data.get("truncated"):
                print(f"[GITHUB] Warning: Tree is truncated for {owner}/{repo}")
            return data.get("tree", [])

    def filter_relevant_files(self, tree: List[Dict]) -> List[Dict]:
        """Select files that matter, avoiding noise."""
        selected = []
        for item in tree:
            if item["type"] != "blob":
                continue
            
            path = item["path"]
            parts = path.split("/")
            name = parts[-1].lower()
            
            # Skip hidden files or specific ignores (unless they are priority like .env.example)
            if any(p.startswith(".") and p not in {".env.example"} for p in parts):
                continue
                
            # Skip ignored directories
            if any(d in self.ignore_dirs for d in parts):
                continue
                
            # Skip ignored exact files
            if name in self.ignore_files:
                continue
                
            # Skip binaries
            ext = os.path.splitext(name)[1]
            if ext in self.binary_exts:
                continue
                
            selected.append(item)
            
        # Prioritize files
        def sort_key(item):
            name = item["path"].split("/")[-1].lower()
            if name in self.priority_files:
                return 0
            if name.endswith((".py", ".ts", ".tsx", ".js", ".jsx", ".go", ".rs", ".java", ".cpp")):
                return 1
            return 2
            
        selected.sort(key=sort_key)
        return selected

    async def fetch_file_content(self, owner: str, repo: str, path: str, branch: str) -> str:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
        async with httpx.AsyncClient(timeout=5.0) as client:
            # We don't use api.github.com headers for raw content to avoid auth scope issues if token doesn't match
            resp = await client.get(url)
            if resp.status_code == 200:
                try:
                    return resp.text
                except Exception:
                    return "<Binary or undecodable content>"
            return "<Failed to fetch content>"
