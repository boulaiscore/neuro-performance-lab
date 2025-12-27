-- Allow users to delete their own exercise completions (needed for un-completing tasks/content)
CREATE POLICY "Users can delete their own exercise completions"
ON public.exercise_completions
FOR DELETE
USING (auth.uid() = user_id);
