from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models.domain import ResumeExtractionResponse
from ..services.resume_service import ResumeService

router = APIRouter()
resume_service = ResumeService()

@router.post("/parse", response_model=ResumeExtractionResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parses an uploaded resume document (PDF/DOCX), extracts text,
    and returns a structured AI analysis of skills, experience, and domains.
    """
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        content = await file.read()
        structured_data = await resume_service.process_document(content, file.filename)
        return structured_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
