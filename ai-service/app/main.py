from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from .api import projects, resume, matching, rag

app = FastAPI(
    title="Axon AI Intelligence Service",
    description="Python backend for AI intelligence features in Axon",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/ai/resume", tags=["Resume Intelligence"])
app.include_router(projects.router, prefix="/api/ai/project", tags=["Project Analysis"])
app.include_router(matching.router, prefix="/api/ai/match", tags=["Semantic Matching"])
app.include_router(rag.router, prefix="/api/ai/rag", tags=["RAG"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Axon AI Intelligence"}
