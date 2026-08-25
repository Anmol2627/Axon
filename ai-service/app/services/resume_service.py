import io
import os
import json
from pypdf import PdfReader
from groq import Groq
from app.models.domain import ResumeExtractionResponse, SkillExtraction

class ResumeService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
        else:
            self.client = None

    def extract_text(self, content: bytes, filename: str) -> str:
        if filename.lower().endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        else:
            # Fallback for txt or other raw text types
            try:
                return content.decode('utf-8')
            except Exception:
                return str(content)

    async def process_document(self, content: bytes, filename: str) -> ResumeExtractionResponse:
        text = self.extract_text(content, filename)
        
        import re
        
        # Deterministic extractions
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        url_pattern = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)'
        
        emails = re.findall(email_pattern, text)
        urls = re.findall(url_pattern, text)
        
        deterministic_email = emails[0] if emails else ""
        
        linkedin_url = ""
        github_url = ""
        portfolio_url = ""
        
        for url in urls:
            url_lower = url.lower()
            if "linkedin.com" in url_lower:
                linkedin_url = url
            elif "github.com" in url_lower:
                github_url = url
            elif not linkedin_url and not github_url:
                portfolio_url = url # fallback for portfolio
                
        if not self.client:
            # Fallback mock if no API key
            return ResumeExtractionResponse(
                personalInfo={"name": "No API Key Provided", "email": deterministic_email},
                links={"linkedin": linkedin_url, "github": github_url, "portfolio": portfolio_url},
                skills=[SkillExtraction(name="Mock Skill", proficiency="Intermediate", confidence=1.0)],
                experience=[],
                projects=[],
                domains=["Mock"],
                suggestedRoles=["Mock Role"],
                extractionMetadata={"source": filename, "error": "GROQ_API_KEY not set"}
            )

        # Call Groq for JSON extraction
        prompt = f"""Extract structured data from this resume. Return ONLY a JSON object (no markdown, no explanation).

The JSON must have these keys:
- "personalInfo": {{"name": "string", "email": "string"}}
- "skills": array of {{"name": "string", "proficiency": "string", "confidence": 0.9}}
- "experience": array of {{"title": "string", "company": "string", "duration": "string", "description": "string"}}
- "education": array of {{"degree": "string", "institution": "string", "graduationYear": "string"}}
- "projects": array of {{"title": "string", "description": "string", "technologies": ["string"]}}
- "domains": ["string"]
- "suggestedRoles": ["string"]

Proficiency must be one of: Beginner, Intermediate, Advanced, Expert.
Normalize skill names (e.g. React.js becomes React).

Resume:
{text[:3500]}"""
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Output only valid JSON. No markdown fences, no explanation, no thinking."
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
            print(f"RESUME RAW LLM OUTPUT (first 500 chars): {result_str[:500]}")
            
            import re
            # Strip <think>...</think> blocks from thinking models
            result_str = re.sub(r'<think>.*?</think>', '', result_str, flags=re.DOTALL).strip()
            # Strip markdown code fences
            result_str = re.sub(r'```json\s*', '', result_str)
            result_str = re.sub(r'```\s*', '', result_str)
            result_str = result_str.strip()
            # Extract the JSON object
            json_match = re.search(r'\{.*\}', result_str, flags=re.DOTALL)
            if json_match:
                result_str = json_match.group(0)
            # Fix trailing commas before closing braces/brackets (common LLM mistake)
            result_str = re.sub(r',\s*([}\]])', r'\1', result_str)
            
            data = json.loads(result_str)
            
            # Merge deterministic
            if not data.get("personalInfo"):
                data["personalInfo"] = {}
                
            if deterministic_email and not data["personalInfo"].get("email"):
                data["personalInfo"]["email"] = deterministic_email
                
            data["links"] = {
                "linkedin": linkedin_url,
                "github": github_url,
                "portfolio": portfolio_url
            }
            
            # Add metadata source
            if "extractionMetadata" not in data:
                data["extractionMetadata"] = {}
            data["extractionMetadata"]["source"] = filename
            
            return ResumeExtractionResponse(**data)
            
        except Exception as e:
            # Fallback on error
            print(f"RESUME EXTRACTION ERROR: {str(e)}")
            return ResumeExtractionResponse(
                personalInfo={"name": "Extraction Error", "email": deterministic_email},
                links={"linkedin": linkedin_url, "github": github_url, "portfolio": portfolio_url},
                skills=[],
                experience=[],
                education=[],
                projects=[],
                domains=[],
                suggestedRoles=[],
                extractionMetadata={"source": filename, "error": str(e)}
            )
