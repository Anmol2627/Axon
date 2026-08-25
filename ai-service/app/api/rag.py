from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..services.rag_service import RagService

router = APIRouter()
rag_service = RagService()

class RagQueryRequest(BaseModel):
    query: str
    contextIds: List[str] = []

class RagQueryResponse(BaseModel):
    answer: str
    sources: List[str]

@router.post("/query", response_model=RagQueryResponse)
async def query_rag(req: RagQueryRequest):
    """
    Queries the RAG knowledge base using semantic search and LLM synthesis.
    """
    try:
        result = await rag_service.query(req.query, req.contextIds)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
