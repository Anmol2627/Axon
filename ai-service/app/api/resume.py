from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models.domain import ResumeExtractionResponse
from ..services.resume_service import ResumeService

router = APIRouter()
resume_service = ResumeService()

ALLOWED_EXTENSIONS = ('.pdf', '.docx', '.txt')
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/parse", response_model=ResumeExtractionResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parses an uploaded resume document (PDF/DOCX/TXT), extracts text,
    and returns a structured AI analysis of skills, experience, and domains.
    """
    print(f"[RESUME API] Received file: {file.filename}, content_type: {file.content_type}")

    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Please upload a PDF, DOCX, or TXT file. Got: {file.filename}"
        )

    try:
        content = await file.read()
        print(f"[RESUME API] Read {len(content)} bytes")

        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10 MB.")

        structured_data = await resume_service.process_document(content, file.filename)
        print(f"[RESUME API] Returning structured data with {len(structured_data.skills)} skills")
        return structured_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"[RESUME API] UNHANDLED ERROR: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
