import pytest
import json
from app.services.extraction_service import ExtractionService

@pytest.fixture
def extraction_service():
    return ExtractionService()

def test_clean_llm_json(extraction_service):
    raw = "```json\n{\"complexity\": \"High\"}\n```"
    cleaned = extraction_service._clean_llm_json(raw)
    data = json.loads(cleaned)
    assert data["complexity"] == "High"

@pytest.mark.asyncio
async def test_analyze_project_fallback(extraction_service):
    # Mock no client
    extraction_service.client = None
    
    result = await extraction_service.analyze_project("Test", "Test desc", "Web App")
    
    assert result.projectId == "generated"
    assert len(result.insights) > 0
    assert "Mock" in result.insights[0]
