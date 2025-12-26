import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Play, Sparkles } from "lucide-react";
import { TrainingPlanId } from "@/lib/trainingPlans";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { TrainHeader } from "@/components/app/TrainHeader";
import { CognitiveAgeSphereCompact } from "@/components/dashboard/CognitiveAgeSphereCompact";
import { LastSessionCard } from "@/components/app/LastSessionCard";
import { useUserMetrics } from "@/hooks/useExercises";
import { useLastSession } from "@/hooks/useLastSession";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";
  const trainingPlan = (user?.trainingPlan || "light") as TrainingPlanId;

  const {
    sessionsCompleted,
    sessionsRequired,
    weeklyXPEarned,
    weeklyXPTarget,
  } = useWeeklyProgress();

  const { data: metrics } = useUserMetrics(user?.id);
  const { data: lastSession } = useLastSession();

  // Cognitive Age calculation
  const cognitiveAgeData = useMemo(() => {
    const baselineCognitiveAge = metrics?.baseline_cognitive_age || user?.age || 30;

    const currentFast = metrics?.fast_thinking || 50;
    const currentSlow = metrics?.slow_thinking || 50;
    const currentFocus = metrics?.focus_stability || 50;
    const currentReasoning = metrics?.reasoning_accuracy || 50;
    const currentCreativity = metrics?.creativity || 50;

    const baselineFast = metrics?.baseline_fast_thinking || 50;
    const baselineSlow = metrics?.baseline_slow_thinking || 50;
    const baselineFocus = metrics?.baseline_focus || 50;
    const baselineReasoning = metrics?.baseline_reasoning || 50;
    const baselineCreativity = metrics?.baseline_creativity || 50;

    const currentAvg =
      (currentFast + currentSlow + currentFocus + currentReasoning + currentCreativity) / 5;
    const baselineAvg =
      (baselineFast + baselineSlow + baselineFocus + baselineReasoning + baselineCreativity) / 5;

    const performanceGain = currentAvg - baselineAvg;
    const ageImprovement = performanceGain / 10;
    const currentCognitiveAge = Math.round(baselineCognitiveAge - ageImprovement);
    const delta = currentCognitiveAge - baselineCognitiveAge;

    return { cognitiveAge: currentCognitiveAge, delta };
  }, [metrics, user?.age]);

  const hasProtocol = !!user?.trainingPlan;

  const handleStartSession = () => {
    navigate("/neuro-lab");
  };

  return (
    <AppShell>
      {/* Use flex + h-full so content fills viewport without scroll */}
      <main className="flex flex-col h-[calc(100dvh-theme(spacing.12)-theme(spacing.14))] px-4 py-3 max-w-md mx-auto overflow-hidden">
        {/* Header - compact */}
        <TrainHeader
          trainingPlan={trainingPlan}
          sessionsCompleted={sessionsCompleted}
          sessionsRequired={sessionsRequired}
          weeklyXPEarned={weeklyXPEarned}
          weeklyXPTarget={weeklyXPTarget}
          greetingName={firstName}
        />

        {/* Cognitive Age Sphere - centered flex grow */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          {hasProtocol ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CognitiveAgeSphereCompact
                cognitiveAge={cognitiveAgeData.cognitiveAge}
                delta={cognitiveAgeData.delta}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-card/50 border border-border/30 text-center"
            >
              <Sparkles className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-[13px] text-foreground font-medium mb-1">Set up your training plan</p>
              <p className="text-[11px] text-muted-foreground mb-4">
                Personalize your cognitive training journey
              </p>
              <Link
                to="/onboarding"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </div>

        {/* Bottom section: Last Session + CTA */}
        {hasProtocol && (
          <div className="space-y-3 pb-1">
            {/* Last Session */}
            {lastSession && (
              <LastSessionCard
                area={lastSession.area}
                score={lastSession.score}
                durationOption={lastSession.duration_option}
                completedAt={lastSession.completed_at}
              />
            )}

            {/* Start Training CTA with glow animation */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={handleStartSession}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
                "bg-primary text-primary-foreground text-[14px] font-semibold",
                "hover:bg-primary/90 active:scale-[0.98] transition-all",
                "shadow-[0_0_24px_-4px_hsl(var(--primary)/0.5)] animate-glow-pulse"
              )}
            >
              <Play className="w-5 h-5 fill-current" />
              Start Training
            </motion.button>
          </div>
        )}
      </main>
    </AppShell>
  );
};

export default Home;
