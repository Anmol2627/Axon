import os
from typing import List
import numpy as np
import json
from supabase import create_client, Client
from ..models.domain import MatchInsight

# Initialize model lazily to avoid slow startup if not used immediately
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except ImportError:
            _model = None
    return _model

def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Supabase URL and Key must be provided in environment.")
    return create_client(url, key)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

class SemanticMatchingService:
    async def compute_matches(self, project_id: str, user_ids: List[str]) -> List[MatchInsight]:
        model = get_model()
        
        if not model:
            # Fallback if sentence-transformers not installed properly
            results = []
            for uid in user_ids:
                results.append(MatchInsight(
                    userId=uid, 
                    semanticScore=50, 
                    insights=["Sentence-transformers model not loaded."]
                ))
            return results

        supabase = get_supabase_client()

        # 1. Fetch project analysis and project details
        project_res = supabase.table('projects').select('*').eq('id', project_id).execute()
        if not project_res.data:
            raise ValueError(f"Project {project_id} not found in Supabase")
        project = project_res.data[0]
        
        analysis_res = supabase.table('project_analyses').select('*').eq('project_id', project_id).execute()
        if not analysis_res.data:
            # Fallback if no analysis
            required_skills = []
            recommended_roles = []
        else:
            analysis = analysis_res.data[0]
            required_skills = [s.get('skillName', '').lower() for s in analysis.get('required_skills', [])]
            recommended_roles = [r.get('title', '').lower() for r in analysis.get('recommended_roles', [])]
            
        # If still empty, use manual skills
        if not required_skills:
            required_skills = [s.lower() for s in project.get('manual_skills', [])]
            
        # 2. Fetch profiles
        profiles_res = supabase.table('profiles').select('*').execute()
        profiles_data = { p['user_id']: p for p in profiles_res.data }
        
        # 3. Deterministic Scoring
        results = []
        for uid in user_ids:
            profile = profiles_data.get(uid)
            if not profile:
                results.append(MatchInsight(userId=uid, semanticScore=0, insights=["Profile not found."]))
                continue
                
            # Profile data
            candidate_skills = [s.get('name', '').lower() for s in profile.get('skills', []) if isinstance(s, dict)]
            candidate_roles = [r.lower() for r in profile.get('preferred_roles', [])]
            
            # Additional role from experience/headline if we had one
            experience = profile.get('experience', [])
            for exp in experience:
                if isinstance(exp, dict) and exp.get('title'):
                    candidate_roles.append(exp.get('title', '').lower())
                    
            # A. Skill Overlap (50%)
            skill_score = 0
            matched_skills = []
            if required_skills:
                for req_skill in required_skills:
                    # Simple substring/inclusion match for normalization (e.g. "react" in "react.js")
                    if any(req_skill in c_skill or c_skill in req_skill for c_skill in candidate_skills):
                        skill_score += 1
                        matched_skills.append(req_skill)
                skill_percentage = (skill_score / len(required_skills)) * 50
            else:
                skill_percentage = 25 # default if no skills specified
                
            # B. Role Relevance (20%)
            role_score = 0
            if recommended_roles:
                for req_role in recommended_roles:
                    if any(req_role in c_role or c_role in req_role for c_role in candidate_roles):
                        role_score = 20
                        break
            else:
                role_score = 10
                
            # C. Experience/Projects (20%)
            exp_score = 0
            if len(experience) > 0:
                exp_score = 10 # Baseline for having experience
                # Bonus if experience matches category
                category_lower = project.get('category', '').lower()
                if any(category_lower in exp.get('description', '').lower() for exp in experience if isinstance(exp, dict)):
                    exp_score = 20
                    
            # D. Interest/Domain (10%)
            interest_score = 0
            candidate_interests = [i.lower() for i in profile.get('interests', [])]
            category_lower = project.get('category', '').lower()
            if any(category_lower in interest for interest in candidate_interests):
                interest_score = 10
                
            # Total Score
            total_score = int(skill_percentage + role_score + exp_score + interest_score)
            
            # Generate Insights
            insights = []
            if len(matched_skills) > 0:
                insights.append(f"Strong overlap with required skills: {', '.join([s.title() for s in matched_skills[:3]])}.")
            else:
                insights.append("Missing core technical skills required for this project.")
                
            if role_score == 20:
                insights.append("Candidate has direct experience in the recommended roles.")
                
            results.append(MatchInsight(userId=uid, semanticScore=total_score, insights=insights))
            
        # Sort by highest score
        results.sort(key=lambda x: x.semanticScore, reverse=True)
        return results
