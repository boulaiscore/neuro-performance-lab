import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserMetrics } from "@/hooks/useExercises";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { useWeeklyDetoxXP } from "@/hooks/useDetoxProgress";
import { 
  calculateSCI, 
  getSCIStatusText, 
  getSCILevel,
  getTargetsForPlan,
  type SCIBreakdown,
  type CognitiveMetricsInput,
  type BehavioralEngagementInput,
  type RecoveryInput,
} from "@/lib/cognitiveNetworkScore";

interface UseCognitiveNetworkScoreResult {
  sci: SCIBreakdown | null;
  statusText: string;
  level: "elite" | "high" | "moderate" | "developing" | "early";
  isLoading: boolean;
}

/**
 * Hook to calculate the Synthesized Cognitive Index (SCI)
 * Aggregates data from:
 * - user_cognitive_metrics (raw cognitive scores)
 * - weekly XP tracking (games + tasks engagement)
 * - weekly detox data (recovery factor)
 */
export function useCognitiveNetworkScore(): UseCognitiveNetworkScoreResult {
  const { user } = useAuth();
  
  // Fetch cognitive metrics
  const { data: metrics, isLoading: metricsLoading } = useUserMetrics(user?.id);
  
  // Fetch weekly progress (games, tasks, sessions)
  const { 
    weeklyGamesXP, 
    weeklyContentXP,
    sessionsCompleted,
    sessionsRequired,
    isLoading: progressLoading 
  } = useWeeklyProgress();
  
  // Fetch weekly detox data
  const { data: detoxData, isLoading: detoxLoading } = useWeeklyDetoxXP();

  const isLoading = metricsLoading || progressLoading || detoxLoading;

  const result = useMemo(() => {
    if (!metrics) {
      return {
        sci: null,
        statusText: "Loading...",
        level: "early" as const,
      };
    }

    // Get training plan targets
    const trainingPlan = user?.trainingPlan || "expert";
    const targets = getTargetsForPlan(trainingPlan);

    // Prepare cognitive metrics input
    const cognitiveInput: CognitiveMetricsInput = {
      reasoning_accuracy: metrics.reasoning_accuracy ?? 50,
      focus_stability: metrics.focus_stability ?? 50,
      decision_quality: metrics.decision_quality ?? 50,
      creativity: metrics.creativity ?? 50,
      fast_thinking: metrics.fast_thinking ?? 50,
      slow_thinking: metrics.slow_thinking ?? 50,
    };

    // Prepare behavioral engagement input
    const behavioralInput: BehavioralEngagementInput = {
      weeklyGamesXP: weeklyGamesXP ?? 0,
      gamesTarget: targets.gamesXP,
      weeklyTasksXP: weeklyContentXP ?? 0,
      tasksTarget: targets.tasksXP,
      sessionsCompleted: sessionsCompleted ?? 0,
      sessionsRequired: targets.sessionsRequired,
    };

    // Prepare recovery input
    const recoveryInput: RecoveryInput = {
      weeklyDetoxMinutes: detoxData?.totalMinutes ?? 0,
      detoxTarget: targets.detoxMinutes,
    };

    // Calculate SCI
    const sci = calculateSCI(cognitiveInput, behavioralInput, recoveryInput);
    const statusText = getSCIStatusText(sci.total);
    const level = getSCILevel(sci.total);

    return { sci, statusText, level };
  }, [metrics, weeklyGamesXP, weeklyContentXP, sessionsCompleted, sessionsRequired, detoxData, user?.trainingPlan]);

  return {
    ...result,
    isLoading,
  };
}
