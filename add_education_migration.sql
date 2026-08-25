-- Add education to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb;
