# Axon - Intelligent Project & Team Formation

Axon is an AI-powered platform designed to form effective project teams based on skills, interests, availability, experience, and project requirements. It solves the critical problem of team mismatch by deeply analyzing both the people and the projects.

## Core Features

- **AI Resume Parser**: Upload a PDF, DOCX, or text resume and let Axon intelligently extract skills, experience, and domains using structured JSON output from LLMs (or robust deterministic fallbacks).
- **AI Project Analyzer**: Describe your project idea in plain English. The AI automatically recommends technical complexity, required skills, and team roles dynamically based on your description.
- **Explainable Semantic Matching Engine**: Discover the perfect collaborators using a deterministic weighted scoring system (Skill Match, Role Relevance, Experience, Interests). Axon gives you transparent, plain-language insights explaining *why* someone is a good match.
- **Premium User Experience**: Designed with a warm, calm, organic aesthetic. Enjoy smooth micro-animations, glassmorphism, and dynamic state feedback.

## Architecture

- **Frontend**: Next.js (App Router), React, TypeScript.
- **Backend**: FastAPI (Python), Pydantic for validation, Groq SDK for fast LLM inference.
- **Database**: Supabase (PostgreSQL) for structured data storage.
- **Routing**: Next.js proxy rewrite securely routes `/api/ai/*` to the FastAPI backend, ensuring API keys remain completely isolated from the client.

## Setup & Deployment

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Supabase Project & Groq API Key

### 1. Environment Variables

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

Create `.env` in `ai-service`:
```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 2. Run Backend
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Run Frontend
```bash
npm install
npm run dev
```

## Testing

The backend includes a comprehensive pytest suite to verify deterministic algorithms and AI fallback behavior.
```bash
cd ai-service
set PYTHONPATH=ai-service
.\venv\Scripts\pytest tests/
```

## Security & Reliability
- **Isolated Secrets**: The `GROQ_API_KEY` is never exposed to the frontend.
- **Robust Parsers**: The AI services use strict validation and fallback to deterministic regex extraction if the LLM fails or is unavailable.
- **File Validation**: Uploads are restricted by size and extension before processing.
