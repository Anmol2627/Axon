-- Add recommended_workflow to project_analyses table
ALTER TABLE public.project_analyses 
ADD COLUMN IF NOT EXISTS recommended_workflow jsonb DEFAULT '[]'::jsonb;
