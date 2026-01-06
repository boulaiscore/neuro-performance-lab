/**
 * Synthesized Cognitive Index (SCI)
 * 
 * A scientifically-grounded cognitive network score based on:
 * - Cognitive Reserve Theory (Stern 2002, Medaglia et al. 2017)
 * - Dual-Process Theory (Kahneman, Gronchi 2018)
 * - Attention Restoration Theory (Kaplan 1995)
 * 
 * Formula: SCI = (0.50 × CP) + (0.30 × BE) + (0.20 × RF)
 * 
 * Where:
 * - CP = Cognitive Performance (raw abilities + dual-process balance)
 * - BE = Behavioral Engagement (games, tasks, session consistency)
 * - RF = Recovery Factor (digital detox)
 */

// Component weights
const WEIGHTS = {
  COGNITIVE_PERFORMANCE: 0.50,
  BEHAVIORAL_ENGAGEMENT: 0.30,
  RECOVERY_FACTOR: 0.20,
};

// Cognitive Performance sub-weights
const CP_WEIGHTS = {
  REASONING: 0.25,
  FOCUS: 0.25,
  DECISION_QUALITY: 0.20,
  CREATIVITY: 0.15,
  DUAL_PROCESS_BALANCE: 0.15,
};

// Behavioral Engagement sub-weights
const BE_WEIGHTS = {
  GAMES: 0.50,
  TASKS: 0.30,
  SESSION_CONSISTENCY: 0.20,
};

export interface CognitiveMetricsInput {
  reasoning_accuracy: number;
  focus_stability: number;
  decision_quality: number;
  creativity: number;
  fast_thinking: number;
  slow_thinking: number;
}

export interface BehavioralEngagementInput {
  weeklyGamesXP: number;
  gamesTarget: number;
  weeklyTasksXP: number;
  tasksTarget: number;
  sessionsCompleted: number;
  sessionsRequired: number;
}

export interface RecoveryInput {
  weeklyDetoxMinutes: number;
  detoxTarget: number;
}

export interface SCIBreakdown {
  total: number;
  cognitivePerformance: {
    score: number;
    weighted: number;
    components: {
      reasoning: number;
      focus: number;
      decisionQuality: number;
      creativity: number;
      dualProcessBalance: number;
    };
  };
  behavioralEngagement: {
    score: number;
    weighted: number;
    components: {
      gamesEngagement: number;
      tasksEngagement: number;
      sessionConsistency: number;
    };
  };
  recoveryFactor: {
    score: number;
    weighted: number;
  };
}

/**
 * Calculate Dual-Process Balance
 * Perfect balance (fast ≈ slow) = 100
 * Maximum imbalance (|fast - slow| = 100) = 0
 */
function calculateDualProcessBalance(fastScore: number, slowScore: number): number {
  const imbalance = Math.abs(fastScore - slowScore);
  return Math.max(0, 100 - imbalance);
}

/**
 * Calculate Cognitive Performance Component (50% of SCI)
 */
function calculateCognitivePerformance(metrics: CognitiveMetricsInput): {
  score: number;
  components: SCIBreakdown["cognitivePerformance"]["components"];
} {
  const dualProcessBalance = calculateDualProcessBalance(
    metrics.fast_thinking,
    metrics.slow_thinking
  );

  const components = {
    reasoning: metrics.reasoning_accuracy,
    focus: metrics.focus_stability,
    decisionQuality: metrics.decision_quality,
    creativity: metrics.creativity,
    dualProcessBalance,
  };

  const score =
    CP_WEIGHTS.REASONING * metrics.reasoning_accuracy +
    CP_WEIGHTS.FOCUS * metrics.focus_stability +
    CP_WEIGHTS.DECISION_QUALITY * metrics.decision_quality +
    CP_WEIGHTS.CREATIVITY * metrics.creativity +
    CP_WEIGHTS.DUAL_PROCESS_BALANCE * dualProcessBalance;

  return { score: Math.round(score), components };
}

/**
 * Calculate Behavioral Engagement Component (30% of SCI)
 */
function calculateBehavioralEngagement(input: BehavioralEngagementInput): {
  score: number;
  components: SCIBreakdown["behavioralEngagement"]["components"];
} {
  // Cap each engagement at 100%
  const gamesEngagement = Math.min(100, (input.weeklyGamesXP / Math.max(1, input.gamesTarget)) * 100);
  const tasksEngagement = Math.min(100, (input.weeklyTasksXP / Math.max(1, input.tasksTarget)) * 100);
  const sessionConsistency = Math.min(100, (input.sessionsCompleted / Math.max(1, input.sessionsRequired)) * 100);

  const components = {
    gamesEngagement: Math.round(gamesEngagement),
    tasksEngagement: Math.round(tasksEngagement),
    sessionConsistency: Math.round(sessionConsistency),
  };

  const score =
    BE_WEIGHTS.GAMES * gamesEngagement +
    BE_WEIGHTS.TASKS * tasksEngagement +
    BE_WEIGHTS.SESSION_CONSISTENCY * sessionConsistency;

  return { score: Math.round(score), components };
}

/**
 * Calculate Recovery Factor (20% of SCI)
 */
function calculateRecoveryFactor(input: RecoveryInput): number {
  const detoxProgress = Math.min(100, (input.weeklyDetoxMinutes / Math.max(1, input.detoxTarget)) * 100);
  return Math.round(detoxProgress);
}

/**
 * Calculate the full Synthesized Cognitive Index with breakdown
 */
export function calculateSCI(
  metrics: CognitiveMetricsInput,
  behavioral: BehavioralEngagementInput,
  recovery: RecoveryInput
): SCIBreakdown {
  const cpResult = calculateCognitivePerformance(metrics);
  const beResult = calculateBehavioralEngagement(behavioral);
  const rfScore = calculateRecoveryFactor(recovery);

  const cpWeighted = WEIGHTS.COGNITIVE_PERFORMANCE * cpResult.score;
  const beWeighted = WEIGHTS.BEHAVIORAL_ENGAGEMENT * beResult.score;
  const rfWeighted = WEIGHTS.RECOVERY_FACTOR * rfScore;

  const total = Math.round(cpWeighted + beWeighted + rfWeighted);

  return {
    total: Math.min(100, Math.max(0, total)),
    cognitivePerformance: {
      score: cpResult.score,
      weighted: Math.round(cpWeighted),
      components: cpResult.components,
    },
    behavioralEngagement: {
      score: beResult.score,
      weighted: Math.round(beWeighted),
      components: beResult.components,
    },
    recoveryFactor: {
      score: rfScore,
      weighted: Math.round(rfWeighted),
    },
  };
}

/**
 * Get status text based on SCI score
 */
export function getSCIStatusText(score: number): string {
  if (score >= 80) return "Elite cognitive integration";
  if (score >= 65) return "High strategic clarity";
  if (score >= 50) return "Developing strategic capacity";
  if (score >= 35) return "Building cognitive foundation";
  return "Early activation phase";
}

/**
 * Get level classification
 */
export function getSCILevel(score: number): "elite" | "high" | "moderate" | "developing" | "early" {
  if (score >= 80) return "elite";
  if (score >= 65) return "high";
  if (score >= 50) return "moderate";
  if (score >= 35) return "developing";
  return "early";
}

// Default targets based on training plans
export const DEFAULT_TARGETS = {
  light: {
    gamesXP: 60,
    tasksXP: 30,
    detoxMinutes: 90,
    sessionsRequired: 3,
  },
  expert: {
    gamesXP: 100,
    tasksXP: 60,
    detoxMinutes: 120,
    sessionsRequired: 5,
  },
  superhuman: {
    gamesXP: 160,
    tasksXP: 100,
    detoxMinutes: 180,
    sessionsRequired: 7,
  },
};

export type TrainingPlanType = keyof typeof DEFAULT_TARGETS;

export function getTargetsForPlan(plan: string): typeof DEFAULT_TARGETS.expert {
  if (plan === "light") return DEFAULT_TARGETS.light;
  if (plan === "superhuman") return DEFAULT_TARGETS.superhuman;
  return DEFAULT_TARGETS.expert;
}
