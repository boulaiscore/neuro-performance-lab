-- Create table for tracking listened podcasts
CREATE TABLE public.user_listened_podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  podcast_id TEXT NOT NULL,
  listened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, podcast_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_listened_podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own listened podcasts" 
ON public.user_listened_podcasts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listened podcasts" 
ON public.user_listened_podcasts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listened podcasts" 
ON public.user_listened_podcasts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX idx_user_listened_podcasts_user_id ON public.user_listened_podcasts(user_id);