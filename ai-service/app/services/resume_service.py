import io
import os
import re
import json
from pypdf import PdfReader
from groq import Groq
from ..models.domain import ResumeExtractionResponse, SkillExtraction

# Known skills vocabulary for deterministic fallback matching
KNOWN_SKILLS = [
    "Python", "JavaScript", "TypeScript", "Java", "C", "C++", "C#", "Go", "Rust", "Ruby",
    "Swift", "Kotlin", "PHP", "Scala", "R", "MATLAB", "Dart", "Lua",
    "React", "Angular", "Vue", "Next.js", "Svelte", "HTML", "CSS", "Tailwind",
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring", "Rails",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "CI/CD",
    "Git", "GitHub", "GitLab", "Linux", "Nginx", "GraphQL", "REST",
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Science",
    "Figma", "Photoshop", "Illustrator", "UI/UX",
    "Agile", "Scrum", "Jira", "Confluence",
]


class ResumeService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
        else:
            self.client = None
        print(f"[RESUME] Service initialized. Groq API key: {'SET' if self.groq_api_key else 'NOT SET'}")

    def extract_text(self, content: bytes, filename: str) -> str:
        """Extract raw text from PDF, DOCX, or plain text files."""
        lower = filename.lower()

        if lower.endswith(".pdf"):
            print("[RESUME] Extracting text from PDF...")
            try:
                reader = PdfReader(io.BytesIO(content))
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text.strip()
            except Exception as e:
                print(f"[RESUME] PDF extraction failed: {e}")
                return ""

        elif lower.endswith(".docx"):
            print("[RESUME] Extracting text from DOCX...")
            try:
                from docx import Document
                doc = Document(io.BytesIO(content))
                text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
                return text.strip()
            except ImportError:
                print("[RESUME] python-docx not installed, falling back to raw decode")
                try:
                    return content.decode('utf-8', errors='ignore')
                except Exception:
                    return ""
            except Exception as e:
                print(f"[RESUME] DOCX extraction failed: {e}")
                return ""

        else:
            # Plain text / txt fallback
            try:
                return content.decode('utf-8', errors='ignore').strip()
            except Exception:
                return ""

    def _deterministic_extract(self, text: str, filename: str) -> dict:
        """Regex-based fallback extraction when Groq is unavailable."""
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+'
        phone_pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}'
        url_pattern = r'https?://[^\s<>\"\']+|[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+/[^\s<>\"\']+' 

        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        urls = re.findall(url_pattern, text)

        email = emails[0] if emails else ""
        phone = phones[0].strip() if phones else ""

        linkedin_url = ""
        github_url = ""
        portfolio_url = ""
        for url in urls:
            low = url.lower()
            if "linkedin.com" in low:
                linkedin_url = url
            elif "github.com" in low:
                github_url = url
            elif not portfolio_url:
                portfolio_url = url

        # Simple skill matching against known vocabulary
        text_lower = text.lower()
        found_skills = []
        for skill in KNOWN_SKILLS:
            if skill.lower() in text_lower:
                found_skills.append(skill)

        return {
            "email": email,
            "phone": phone,
            "linkedin": linkedin_url,
            "github": github_url,
            "portfolio": portfolio_url,
            "skills": found_skills,
        }

    def _clean_llm_json(self, raw: str) -> str:
        """Clean LLM output to extract valid JSON."""
        cleaned = raw

        # Handle <think> blocks - the model may or may not close them
        if '<think>' in cleaned:
            if '</think>' in cleaned:
                cleaned = re.sub(r'<think>.*?</think>', '', cleaned, flags=re.DOTALL).strip()
            else:
                print("[RESUME] WARNING: <think> tag found but no </think> closing tag")
                cleaned = cleaned.replace('<think>', '')

        # Strip ALL markdown code fences FIRST (before JSON extraction)
        cleaned = re.sub(r'```json\s*', '\n', cleaned)
        cleaned = re.sub(r'```\s*', '\n', cleaned)
        cleaned = cleaned.strip()

        # Find ALL complete top-level JSON objects by brace counting
        json_objects = []
        i = 0
        in_string = False
        escape_next = False
        while i < len(cleaned):
            ch = cleaned[i]
            if ch == '{' and not in_string:
                depth = 0
                start = i
                str_mode = False
                esc = False
                valid = True
                for j in range(i, len(cleaned)):
                    c = cleaned[j]
                    if esc:
                        esc = False
                        continue
                    if c == '\\' and str_mode:
                        esc = True
                        continue
                    if c == '"' and not esc:
                        str_mode = not str_mode
                        continue
                    if str_mode:
                        continue
                    if c == '{':
                        depth += 1
                    elif c == '}':
                        depth -= 1
                        if depth == 0:
                            candidate = cleaned[start:j+1]
                            # Quick validation: must have at least one colon (key-value pair)
                            if ':' in candidate and len(candidate) > 10:
                                json_objects.append(candidate)
                            i = j + 1
                            break
                else:
                    # Didn't find closing brace
                    i += 1
            else:
                i += 1

        if not json_objects:
            print("[RESUME] No JSON objects found in LLM output")
            return "{}"

        # Pick the largest JSON object (the actual data, not schema templates)
        best = max(json_objects, key=len)
        print(f"[RESUME] Found {len(json_objects)} JSON objects, using largest ({len(best)} chars)")

        # Fix trailing commas
        best = re.sub(r',\s*([}\]])', r'\1', best)
        return best

    def _normalize_proficiency(self, val: str) -> str:
        """Normalize LLM proficiency strings to valid Literal values."""
        mapping = {
            "beginner": "Beginner",
            "basic": "Beginner",
            "junior": "Beginner",
            "intermediate": "Intermediate",
            "mid": "Intermediate",
            "mid-level": "Intermediate",
            "advanced": "Advanced",
            "senior": "Advanced",
            "expert": "Expert",
            "master": "Expert",
        }
        return mapping.get(val.lower().strip(), "Intermediate")

    async def process_document(self, content: bytes, filename: str) -> ResumeExtractionResponse:
        print(f"[RESUME] Upload received: {filename} ({len(content)} bytes)")

        # Step 1: Extract text
        text = self.extract_text(content, filename)
        print(f"[RESUME] Extracted {len(text)} characters of text")

        if len(text.strip()) < 50:
            print("[RESUME] WARNING: Very little text extracted")
            return ResumeExtractionResponse(
                personalInfo={"name": "", "email": ""},
                links={},
                skills=[],
                experience=[],
                education=[],
                projects=[],
                domains=[],
                suggestedRoles=[],
                extractionMetadata={
                    "source": filename,
                    "error": "This resume appears to be scanned or image-based and contains no extractable text. Please upload a text-based PDF or DOCX."
                }
            )

        # Step 2: Deterministic extractions (always run as fallback data)
        det = self._deterministic_extract(text, filename)
        print(f"[RESUME] Deterministic: email={det['email']}, skills_found={len(det['skills'])}")

        # Step 3: If no Groq client, return deterministic-only result
        if not self.client:
            print("[RESUME] No Groq API key — returning deterministic fallback only")
            skills = [SkillExtraction(name=s, proficiency="Intermediate", confidence=0.6) for s in det["skills"][:20]]
            return ResumeExtractionResponse(
                personalInfo={"name": "", "email": det["email"]},
                links={"linkedin": det["linkedin"], "github": det["github"], "portfolio": det["portfolio"]},
                skills=skills,
                experience=[],
                education=[],
                projects=[],
                domains=[],
                suggestedRoles=[],
                extractionMetadata={"source": filename, "method": "deterministic_fallback"}
            )

        # Step 4: Call Groq
        # Use a simple non-f-string prompt to avoid bracket escaping issues
        prompt_template = """Extract structured data from this resume. Return ONLY a raw JSON object. Do not wrap it in markdown. Do not add any explanation.

The JSON must follow this exact structure:
{
  "personalInfo": {"name": "", "email": ""},
  "skills": [{"name": "", "proficiency": "Intermediate", "confidence": 0.9}],
  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
  "education": [{"degree": "", "institution": "", "graduationYear": ""}],
  "projects": [{"title": "", "description": "", "technologies": []}],
  "domains": [],
  "suggestedRoles": []
}

Rules:
- proficiency must be exactly one of: Beginner, Intermediate, Advanced, Expert
- confidence is a float between 0 and 1
- Only extract information that is actually in the resume
- Do not invent or fabricate any data
- Normalize skill names (e.g. "React.js" becomes "React")
- Return empty arrays [] for missing sections

Resume text:
"""
        prompt = prompt_template + text[:3500]

        print("[RESUME] Sending to Groq (qwen/qwen3.6-27b)...")
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a JSON extraction assistant. Output ONLY valid JSON. No markdown, no code fences, no explanations, no thinking."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="qwen/qwen3.6-27b",
                temperature=0.1
            )

            result_str = chat_completion.choices[0].message.content or ""
            print(f"[RESUME] Groq raw response (first 300 chars): {result_str[:300]}")

        except Exception as e:
            print(f"[RESUME] Groq API call FAILED: {e}")
            # Return deterministic fallback
            skills = [SkillExtraction(name=s, proficiency="Intermediate", confidence=0.6) for s in det["skills"][:20]]
            return ResumeExtractionResponse(
                personalInfo={"name": "", "email": det["email"]},
                links={"linkedin": det["linkedin"], "github": det["github"], "portfolio": det["portfolio"]},
                skills=skills,
                experience=[],
                education=[],
                projects=[],
                domains=[],
                suggestedRoles=[],
                extractionMetadata={"source": filename, "method": "deterministic_fallback", "error": str(e)}
            )

        # Step 5: Parse the JSON
        cleaned_json = self._clean_llm_json(result_str)
        print(f"[RESUME] Cleaned JSON (first 300 chars): {cleaned_json[:300]}")

        try:
            data = json.loads(cleaned_json)
            print("[RESUME] JSON parsed successfully")
        except json.JSONDecodeError as e:
            print(f"[RESUME] JSON parse FAILED: {e}")
            print(f"[RESUME] Attempting retry parse...")
            # One more attempt: try to fix common issues
            try:
                # Sometimes the LLM nests objects; try extracting just the first valid object
                fixed = re.sub(r'[\x00-\x1f]', '', cleaned_json)  # Remove control chars
                data = json.loads(fixed)
                print("[RESUME] Retry parse succeeded")
            except json.JSONDecodeError:
                print("[RESUME] Retry also failed — returning deterministic fallback")
                skills = [SkillExtraction(name=s, proficiency="Intermediate", confidence=0.6) for s in det["skills"][:20]]
                return ResumeExtractionResponse(
                    personalInfo={"name": "", "email": det["email"]},
                    links={"linkedin": det["linkedin"], "github": det["github"], "portfolio": det["portfolio"]},
                    skills=skills,
                    experience=[],
                    education=[],
                    projects=[],
                    domains=[],
                    suggestedRoles=[],
                    extractionMetadata={"source": filename, "method": "deterministic_fallback", "error": f"LLM returned invalid JSON: {cleaned_json[:200]}"}
                )

        # Step 6: Normalize and validate fields
        # Normalize skills
        raw_skills = data.get("skills", [])
        validated_skills = []
        seen_skill_names = set()
        for s in raw_skills:
            if not isinstance(s, dict):
                continue
            name = str(s.get("name", "")).strip()
            if not name or name.lower() in seen_skill_names:
                continue
            seen_skill_names.add(name.lower())
            prof = self._normalize_proficiency(str(s.get("proficiency", "Intermediate")))
            try:
                conf = float(s.get("confidence", 0.8))
                conf = max(0.0, min(1.0, conf))
            except (ValueError, TypeError):
                conf = 0.8
            validated_skills.append(SkillExtraction(name=name, proficiency=prof, confidence=conf))

        # Merge deterministic email if AI missed it
        personal_info = data.get("personalInfo", {})
        if not isinstance(personal_info, dict):
            personal_info = {}
        if not personal_info.get("email") and det["email"]:
            personal_info["email"] = det["email"]

        # Build links from deterministic extraction (more reliable than LLM for URLs)
        links = {
            "linkedin": det["linkedin"],
            "github": det["github"],
            "portfolio": det["portfolio"],
        }

        # Metadata
        extraction_metadata = {"source": filename, "method": "groq_ai", "skills_extracted": len(validated_skills)}

        result = ResumeExtractionResponse(
            personalInfo=personal_info,
            links=links,
            skills=validated_skills,
            experience=data.get("experience", []),
            education=data.get("education", []),
            projects=data.get("projects", []),
            domains=data.get("domains", []),
            suggestedRoles=data.get("suggestedRoles", []),
            extractionMetadata=extraction_metadata,
        )

        print(f"[RESUME] Profile data generated successfully: {len(validated_skills)} skills, {len(data.get('experience', []))} experiences, {len(data.get('education', []))} education entries")
        return result
