import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifiedLearningPath } from "@/components/dashboard/UnifiedLearningPath";
import { TRAINING_PLANS, TrainingPlanId } from "@/lib/trainingPlans";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { useMonthlyContent } from "@/hooks/useMonthlyContent";
import { useBadges } from "@/hooks/useBadges";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";
  const trainingPlan = (user?.trainingPlan || "light") as TrainingPlanId;
  const plan = TRAINING_PLANS[trainingPlan];

  const { completedSessionTypes } = useWeeklyProgress();
  const { assignments, isLoading: isLoadingContent } = useMonthlyContent();
  const { experiencePoints, cognitiveLevel } = useBadges();

  const hasProtocol = !!user?.trainingPlan;

  const handleStartSession = () => {
    navigate("/neuro-lab");
  };

  return (
    <AppShell>
      <div className="px-5 py-6 max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
              {plan.name}
            </p>
            <h1 className="text-lg font-semibold tracking-tight">
              Hey {firstName} 👋
            </h1>
          </div>
          <Link 
            to="/app/account" 
            className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </Link>
        </motion.div>

        {/* Unified Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card/50 border border-border/30"
        >
          {hasProtocol ? (
            <UnifiedLearningPath
              planId={trainingPlan}
              completedSessionTypes={completedSessionTypes}
              experiencePoints={experiencePoints}
              cognitiveLevel={cognitiveLevel}
              contentAssignments={assignments || []}
              onStartSession={handleStartSession}
            />
          ) : (
            <div className="text-center py-8">
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
            </div>
          )}
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center pt-6"
        >
          <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
            Complete sessions in order to unlock<br />
            new content and level up faster
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Home;
