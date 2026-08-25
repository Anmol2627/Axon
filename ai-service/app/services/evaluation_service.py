import json
import re
from typing import Dict, Any, List
from groq import Groq
import os
import asyncio

from .github_service import GitHubService

class EvaluationService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
        else:
            self.client = None
        self.github = GitHubService()

    def _clean_llm_json(self, raw: str) -> str:
        """Clean LLM output to extract valid JSON."""
        cleaned = raw
        if '<think>' in cleaned:
            cleaned = re.sub(r'<think>.*?</think>', '', cleaned, flags=re.DOTALL).strip()
            cleaned = cleaned.replace('<think>', '')

        cleaned = re.sub(r'```json\s*', '\n', cleaned)
        cleaned = re.sub(r'```\s*', '\n', cleaned)
        cleaned = cleaned.strip()

        json_match = re.search(r'\{.*\}', cleaned, flags=re.DOTALL)
        if json_match:
            return json_match.group(0)
        return cleaned

    def _calculate_weighted_score(self, scores: Dict[str, int]) -> int:
        # Default weighting as requested
        weights = {
            "problemAlignment": 0.25,
            "codeQuality": 0.20,
            "security": 0.15,
            "efficiency": 0.15,
            "testing": 0.15,
            "accessibility": 0.10
        }
        total = 0.0
        for key, weight in weights.items():
            total += (scores.get(key, 0) * weight)
        return int(round(total))

    async def evaluate_repository(self, github_url: str) -> Dict[str, Any]:
        if not self.client:
            raise ValueError("GROQ_API_KEY is not configured on the backend.")

        # 1. Parse URL
        owner, repo = self.github.parse_repo_url(github_url)
        if not owner or not repo:
            raise ValueError(f"Invalid GitHub URL format: {github_url}")

        # 2. Fetch metadata & tree
        meta = await self.github.fetch_repo_metadata(owner, repo)
        default_branch = meta.get("default_branch", "main")
        tree = await self.github.fetch_repo_tree(owner, repo, default_branch)

        # 3. Filter files and build context
        selected_files = self.github.filter_relevant_files(tree)
        if not selected_files:
            raise ValueError("No relevant source code found in repository.")

        # Limit to ~10 files or ~15,000 characters total to avoid massive context
        MAX_FILES = 10
        MAX_CHARS = 15000
        
        context_parts = []
        context_parts.append(f"Repository: {owner}/{repo}")
        context_parts.append(f"Description: {meta.get('description', 'None')}")
        context_parts.append(f"Language: {meta.get('language', 'Unknown')}")
        context_parts.append("\nDirectory Structure (Filtered):")
        for f in selected_files[:40]:  # Show up to 40 paths to give architectural context
            context_parts.append(f" - {f['path']}")

        context_parts.append("\nFile Contents:")
        char_count = 0
        fetched_count = 0
        
        # Concurrently fetch up to MAX_FILES
        files_to_fetch = selected_files[:MAX_FILES]
        tasks = [self.github.fetch_file_content(owner, repo, f["path"], default_branch) for f in files_to_fetch]
        contents = await asyncio.gather(*tasks)

        for f, content in zip(files_to_fetch, contents):
            if char_count > MAX_CHARS:
                break
            # Truncate individual massive files
            if len(content) > 5000:
                content = content[:5000] + "\n...[TRUNCATED]"
            
            context_parts.append(f"\n--- FILE: {f['path']} ---")
            context_parts.append(content)
            char_count += len(content)
            fetched_count += 1

        repo_context = "\n".join(context_parts)
        confidence = "high" if fetched_count >= min(5, len(selected_files)) else "medium"
        if fetched_count == 0:
            confidence = "low"

        # 4. Prompt Groq
        prompt = f"""
You are an expert software engineering evaluator for a coding competition.
Evaluate the following repository against the challenge: "ProjectMatch, Team Formation Platform".
The goal of the challenge is to build a platform that helps people form effective project teams based on skills, interests, availability, experience, and project requirements.

Repository Context:
{repo_context}

Evaluate based strictly on evidence in the provided files.
Score each category 0-100. Be critical. DO NOT default to 95+ unless justified by strong evidence.
If there are no tests, testing score MUST be low.
If there is no frontend, note it and score Accessibility appropriately.

Respond ONLY with a JSON object matching this schema exactly:
{{
  "scores": {{
    "codeQuality": 0,
    "security": 0,
    "efficiency": 0,
    "testing": 0,
    "accessibility": 0,
    "problemAlignment": 0
  }},
  "repositorySummary": {{
    "projectType": "str",
    "languages": ["str"],
    "technologies": ["str"],
    "architectureSummary": "str"
  }},
  "strengths": [
    {{ "title": "str", "description": "str", "evidence": "str" }}
  ],
  "issues": [
    {{ "severity": "critical|high|medium|low", "category": "str", "title": "str", "description": "str", "evidence": "str", "recommendation": "str" }}
  ],
  "categoryFeedback": {{
    "codeQuality": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }},
    "security": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }},
    "efficiency": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }},
    "testing": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }},
    "accessibility": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }},
    "problemAlignment": {{ "summary": "str", "strengths": ["str"], "improvements": ["str"] }}
  }},
  "finalVerdict": "str",
  "topPriorityImprovements": ["str"]
}}
"""
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON-only evaluation assistant. Output strictly valid JSON."},
                {"role": "user", "content": prompt}
            ],
            model="qwen/qwen3.6-27b",
            temperature=0.1
        )
        
        result_str = chat_completion.choices[0].message.content
        cleaned_json = self._clean_llm_json(result_str)
        
        try:
            data = json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            raise ValueError(f"AI returned malformed JSON: {str(e)}")

        # 5. Calculate Weighted Score
        scores = data.get("scores", {})
        overall_score = self._calculate_weighted_score(scores)
        data["overallScore"] = overall_score
        data["confidence"] = confidence

        return data
