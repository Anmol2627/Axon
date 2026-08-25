from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..services.semantic_matching_service import SemanticMatchingService
from ..models.domain import MatchInsight, SemanticMatchResponse

router = APIRouter()
matching_service = SemanticMatchingService()

class SemanticMatchRequest(BaseModel):
    projectId: str
    userIds: List[str]

@router.post("/semantic-search", response_model=SemanticMatchResponse)
async def semantic_search(req: SemanticMatchRequest):
    """
    Computes semantic relevance between a project's requirements
    and a list of candidates' unstructured experience profiles.
    """
    try:
        results = await matching_service.compute_matches(req.projectId, req.userIds)
        return SemanticMatchResponse(matches=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
