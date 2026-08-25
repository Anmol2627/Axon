from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from ..services.evaluation_service import EvaluationService
import traceback

router = APIRouter()
evaluation_service = EvaluationService()

class EvaluationRequest(BaseModel):
    githubUrl: str

@router.post("/github")
async def evaluate_github_repo(request: EvaluationRequest):
    """
    Evaluates a GitHub repository using AI against the selected problem statement.
    """
    url = request.githubUrl.strip()
    if not url:
        raise HTTPException(status_code=400, detail="GitHub URL is required.")
        
    try:
        result = await evaluation_service.evaluate_repository(url)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"[EVALUATE API] Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
