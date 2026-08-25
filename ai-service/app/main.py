from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from .api import projects, resume, matching, rag, evaluate

import logging

# Ensure GROQ_API_KEY is present
if not os.getenv("GROQ_API_KEY"):
    logging.warning("GROQ_API_KEY environment variable is missing. AI functionality will fallback to mock responses.")

app = FastAPI(
    title="Axon AI Intelligence Service",
    version="1.0.0",
    description="Provides AI-powered features for Axon using Groq and standard LLMs"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/ai/project", tags=["projects"])
app.include_router(resume.router, prefix="/api/ai/resume", tags=["resume"])
app.include_router(matching.router, prefix="/api/ai/match", tags=["matching"])
app.include_router(rag.router, prefix="/api/ai/rag", tags=["rag"])
app.include_router(evaluate.router, prefix="/api/ai/evaluate", tags=["evaluate"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Axon AI Intelligence"}
