from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..models.domain import ProjectAnalysis
from ..services.extraction_service import ExtractionService

router = APIRouter()
extraction_service = ExtractionService()

class AnalyzeProjectRequest(BaseModel):
    title: str
    description: str
    category: str

@router.post("/analyze", response_model=ProjectAnalysis)
async def analyze_project(req: AnalyzeProjectRequest):
    """
    Analyzes a project description to extract complexity, required skills,
    roles, insights, and risks.
    """
    try:
        # In a real implementation, this would call the LLM service.
        # For now, we mock the response to match the existing Axon functionality
        # but structured from the Python side.
        analysis = await extraction_service.analyze_project(req.title, req.description, req.category)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
