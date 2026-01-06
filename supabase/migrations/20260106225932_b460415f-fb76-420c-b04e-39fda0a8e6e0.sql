-- Create validation function for score and correct/total consistency
CREATE OR REPLACE FUNCTION public.validate_session_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate score is between 0 and 100
  IF NEW.score IS NOT NULL AND (NEW.score < 0 OR NEW.score > 100) THEN
    RAISE EXCEPTION 'Score must be between 0 and 100, got: %', NEW.score;
  END IF;
  
  -- Validate correct_answers does not exceed total_questions
  IF NEW.correct_answers IS NOT NULL AND NEW.total_questions IS NOT NULL THEN
    IF NEW.correct_answers > NEW.total_questions THEN
      RAISE EXCEPTION 'correct_answers (%) cannot exceed total_questions (%)', NEW.correct_answers, NEW.total_questions;
    END IF;
    IF NEW.correct_answers < 0 THEN
      RAISE EXCEPTION 'correct_answers cannot be negative, got: %', NEW.correct_answers;
    END IF;
    IF NEW.total_questions < 1 THEN
      RAISE EXCEPTION 'total_questions must be at least 1, got: %', NEW.total_questions;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create validation function for exercise completions (score only)
CREATE OR REPLACE FUNCTION public.validate_exercise_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate score is between 0 and 100
  IF NEW.score IS NOT NULL AND (NEW.score < 0 OR NEW.score > 100) THEN
    RAISE EXCEPTION 'Score must be between 0 and 100, got: %', NEW.score;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger to neuro_gym_sessions
DROP TRIGGER IF EXISTS validate_neuro_gym_session_scores ON public.neuro_gym_sessions;
CREATE TRIGGER validate_neuro_gym_session_scores
  BEFORE INSERT OR UPDATE ON public.neuro_gym_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_session_scores();

-- Add trigger to training_sessions
DROP TRIGGER IF EXISTS validate_training_session_scores ON public.training_sessions;
CREATE TRIGGER validate_training_session_scores
  BEFORE INSERT OR UPDATE ON public.training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_session_scores();

-- Add trigger to exercise_completions
DROP TRIGGER IF EXISTS validate_exercise_completion_score ON public.exercise_completions;
CREATE TRIGGER validate_exercise_completion_score
  BEFORE INSERT OR UPDATE ON public.exercise_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_exercise_score();