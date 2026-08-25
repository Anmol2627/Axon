import pytest
from unittest.mock import patch, MagicMock
from app.services.semantic_matching_service import SemanticMatchingService

@pytest.fixture
def matching_service():
    return SemanticMatchingService()

@pytest.mark.asyncio
@patch('app.services.semantic_matching_service.get_supabase_client')
@patch('app.services.semantic_matching_service.get_model')
async def test_compute_matches_deterministic_score(mock_get_model, mock_get_supabase, matching_service):
    # Mock model
    mock_get_model.return_value = "dummy_model"
    
    # Mock Supabase
    mock_supabase = MagicMock()
    mock_get_supabase.return_value = mock_supabase
    
    # Mock Project Data
    mock_supabase.table().select().eq().execute.side_effect = [
        # Project table
        MagicMock(data=[{"id": "p1", "category": "AI", "manual_skills": []}]),
        # Analysis table
        MagicMock(data=[{
            "project_id": "p1", 
            "required_skills": [{"skillName": "Python"}],
            "recommended_roles": [{"title": "Backend"}]
        }])
    ]
    
    # Mock Profiles Data
    mock_supabase.table().select().execute.return_value = MagicMock(data=[
        {
            "user_id": "u1",
            "skills": [{"name": "Python"}, {"name": "React"}],
            "preferred_roles": ["Backend"],
            "experience": [{"title": "Backend Dev", "description": "Built AI tools"}],
            "interests": ["AI", "ML"]
        }
    ])
    
    # Run match
    results = await matching_service.compute_matches("p1", ["u1"])
    
    assert len(results) == 1
    match = results[0]
    
    assert match.userId == "u1"
    # Skill overlap (1/1) = 50
    # Role overlap = 20
    # Experience (AI match) = 20
    # Interest (AI match) = 10
    # Total = 100
    assert match.semanticScore == 100
    assert any("Candidate has direct experience" in i for i in match.insights)
