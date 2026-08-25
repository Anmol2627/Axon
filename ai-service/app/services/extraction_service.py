import os
import json
from groq import Groq
from app.models.domain import ProjectAnalysis, ProjectRequirement, RoleRequirement, ProjectRisk

class ExtractionService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if self.groq_api_key:
            self.client = Groq(api_key=self.groq_api_key)
        else:
            self.client = None

    async def analyze_project(self, title: str, description: str, category: str) -> ProjectAnalysis:
        if not self.client:
            # Fallback mock if no API key
            return ProjectAnalysis(
                projectId="generated",
                complexity="Medium",
                recommendedTeamSize=2,
                recommendedRoles=[
                    RoleRequirement(projectId="generated", title="Mock Role", responsibilities=["Mock"], keySkills=["Mock"])
                ],
                requiredSkills=[
                    ProjectRequirement(projectId="generated", skillName="Mock Skill", tier="Important")
                ],
                insights=["Mock insight due to missing API key"],
                risks=[ProjectRisk(label="No API Key", severity="Amber")],
                recommendedWorkflow=[
                    {"phase": "Phase 1: Research", "description": "Mock phase description."}
                ]
            )

        prompt = f"""
You are an expert technical project manager and software architect.
Analyze the following project and output valid JSON ONLY matching the provided schema.

Project Title: {title}
Category: {category}
Description: {description}

Schema:
{{
  "complexity": "Low" | "Medium" | "Medium-High" | "High",
  "recommendedTeamSize": int,
  "recommendedRoles": [
    {{
      "title": "str (e.g. Backend Engineer)",
      "responsibilities": ["str"],
      "keySkills": ["str"]
    }}
  ],
  "requiredSkills": [
    {{
      "skillName": "str",
      "tier": "Critical" | "Important" | "Recommended"
    }}
  ],
  "insights": ["str (Actionable architectural or team insights)"],
  "risks": [
    {{
      "label": "str",
      "severity": "Amber" | "Red"
    }}
  ],
  "recommendedWorkflow": [
    {{
      "phase": "str (e.g. Phase 1: Research)",
      "description": "str (Description of phase)"
    }}
  ]
}}
"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that outputs JSON. Do not include any explanation, only output the JSON object."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="qwen/qwen3.6-27b",
                temperature=0.1
            )
            
            result_str = chat_completion.choices[0].message.content
            # Qwen thinking models may wrap output in <think>...</think> tags
            import re
            result_str = re.sub(r'<think>.*?</think>', '', result_str, flags=re.DOTALL).strip()
            # Extract JSON object if there's any surrounding text
            json_match = re.search(r'\{.*\}', result_str, flags=re.DOTALL)
            if json_match:
                result_str = json_match.group(0)
            data = json.loads(result_str)
            
            data["projectId"] = "generated"
            
            # Ensure required elements have projectId
            for role in data.get("recommendedRoles", []):
                role["projectId"] = "generated"
            for skill in data.get("requiredSkills", []):
                skill["projectId"] = "generated"
                
            return ProjectAnalysis(**data)
            
        except Exception as e:
            return ProjectAnalysis(
                projectId="generated",
                complexity="Medium",
                recommendedTeamSize=0,
                recommendedRoles=[],
                requiredSkills=[],
                insights=[f"Extraction failed: {str(e)}"],
                risks=[ProjectRisk(label="Extraction Error", severity="Red")],
                recommendedWorkflow=[]
            )
