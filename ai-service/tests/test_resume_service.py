import pytest
import io
import json
from app.services.resume_service import ResumeService

@pytest.fixture
def resume_service():
    return ResumeService()

def test_deterministic_extract(resume_service):
    text = "Contact me at user@example.com or +1234567890. Check my github.com/user and linkedin.com/in/user. Skills: Python, React, AWS."
    result = resume_service._deterministic_extract(text, "resume.txt")
    
    assert result["email"] == "user@example.com"
    assert "github.com/user" in result["github"]
    assert "linkedin.com/in/user" in result["linkedin"]
    assert "Python" in result["skills"]
    assert "React" in result["skills"]
    assert "AWS" in result["skills"]

def test_clean_llm_json(resume_service):
    # Test stripping markdown and <think>
    raw = "<think>I need to parse this</think>```json\n{\"skills\": [{\"name\": \"Python\"}]}\n```"
    cleaned = resume_service._clean_llm_json(raw)
    data = json.loads(cleaned)
    assert data["skills"][0]["name"] == "Python"

@pytest.mark.asyncio
async def test_process_document_fallback(resume_service):
    # If groq client is None, it should fallback
    resume_service.client = None
    content = b"My name is John. email: john@test.com. Skills: Java, Spring."
    
    result = await resume_service.process_document(content, "resume.txt")
    
    assert result.personalInfo["email"] == "john@test.com"
    assert any(s.name == "Java" for s in result.skills)
    assert result.extractionMetadata["method"] == "deterministic_fallback"
