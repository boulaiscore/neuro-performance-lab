import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LastSession {
  id: string;
  area: string;
  score: number;
  duration_option: string;
  completed_at: string;
  correct_answers: number;
  total_questions: number;
}

export function useLastSession() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["last-session", user?.id],
    queryFn: async (): Promise<LastSession | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("neuro_gym_sessions")
        .select("id, area, score, duration_option, completed_at, correct_answers, total_questions")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}
