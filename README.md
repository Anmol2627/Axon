# Axon - Intelligent Tech Workforce Assembly

Axon is a modern, AI-powered platform designed to solve the critical problem of matching the right tech talent to the right projects. Instead of relying on manual resume screening and keyword-based searches, Axon leverages LLMs (Large Language Models) to perform deep semantic analysis of both project requirements and candidate capabilities.

## The Problem
Assembling the perfect tech team for a project is slow and error-prone. Project managers often struggle to accurately define technical requirements, and traditional platforms rely on rigid keyword matching that misses nuanced expertise. This leads to skill gaps, delayed projects, and inefficient resource allocation.

## The Solution
Axon acts as an intelligent intermediary. It automatically extracts structured data from candidate resumes (skills, domains, experience levels) and analyzes project descriptions to infer complexity, necessary roles, and hidden required skills. Using high-dimensional semantic search, Axon mathematically matches candidates to projects based on true capability rather than surface-level keywords.

## Core Features
1. **AI Resume to Profile:** Candidates upload their resumes. Axon's intelligent parser reads the document (handling PDFs and text), extracts structured data (education, experience, skills with inferred proficiency), and automatically builds a rich, standardized profile.
2. **AI Project Analyzer:** Project managers simply paste a high-level description of what they want to build. The AI breaks this down into actionable intelligence: estimating complexity, recommending team sizes, identifying required roles, and flagging potential risks.
3. **Intelligent Matchmaking:** When viewing a project, Axon uses a hybrid vector-search and semantic matching engine to score every candidate in the database against the project's specific needs, providing explainable matching scores and identifying team skill gaps.

## Technology Stack
- **Frontend:** Next.js (React), TypeScript, CSS Modules (Custom "Warm Premium" Design System)
- **Backend:** FastAPI (Python), Uvicorn
- **Database & Auth:** Supabase (PostgreSQL with pgvector for semantic search)
- **AI Models:** Groq API (`qwen3.6-27b` for structured JSON extraction), HuggingFace (`all-MiniLM-L6-v2` for embeddings)

## Getting Started

### 1. Database Setup
Create a Supabase project and run the provided SQL scripts in the Supabase SQL Editor:
- `supabase_schema.sql` (Creates core tables and vector indexes)
- `add_links_migration.sql` (Adds links support to profiles)
- `add_workflow_migration.sql` (Adds workflow support to project analyses)
- `add_education_migration.sql` (Adds education support to profiles)
- `seed_data.sql` (Optional: Populates mock users and projects)

### 2. Backend (Python/FastAPI)
Navigate to the `ai-service` directory:
```bash
cd ai-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in `ai-service/` with:
```
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```
Run the backend:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend (Next.js)
In the root directory, create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_AI_API_URL=http://127.0.0.1:8000
```
Install dependencies and run:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## Design Philosophy
Axon breaks away from the cold, overly-technical styling of traditional B2B developer tools. We implemented a "Warm Premium" design system characterized by:
- Soft off-white backgrounds (Oatmeal/Sand)
- Earthy, grounding accents (Terracotta, Sage)
- High-quality typography (Inter/Serif pairings)
- Subtle glassmorphism and micro-animations for an organic, responsive feel.
