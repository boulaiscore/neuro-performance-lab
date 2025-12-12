import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Dumbbell, Settings, Target, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";

  const hasGoals = user?.trainingGoals && user.trainingGoals.length > 0;

  const getDurationLabel = (duration?: string) => {
    switch (duration) {
      case "30s": return "30 secondi";
      case "2min": return "2 minuti";
      case "5min": return "5 minuti";
      case "7min": return "7 minuti";
      default: return "—";
    }
  };

  const getDailyTimeLabel = (time?: string) => {
    switch (time) {
      case "3min": return "3 min/giorno";
      case "7min": return "7 min/giorno";
      case "10min": return "10 min/giorno";
      default: return "—";
    }
  };

  const getGoalsLabel = () => {
    const goals = user?.trainingGoals || [];
    if (goals.includes("fast_thinking") && goals.includes("slow_thinking")) {
      return "Fast & Slow Thinking";
    }
    if (goals.includes("fast_thinking")) return "Fast Thinking";
    if (goals.includes("slow_thinking")) return "Slow Thinking";
    return "Non configurato";
  };

  return (
    <AppShell>
      <div className="px-5 py-6 max-w-md mx-auto">
        {/* Header with greeting */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-1">
            Cognitive Training
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Ciao, {firstName}
          </h1>
        </motion.div>

        {/* Main CTA - Cognitive Lab */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <button
            onClick={() => navigate("/neuro-lab")}
            className={cn(
              "group w-full p-5 rounded-2xl",
              "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
              "border border-primary/30 hover:border-primary/50",
              "transition-all duration-300 text-left active:scale-[0.98]",
              "relative overflow-hidden"
            )}
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-semibold text-foreground mb-0.5">
                  Inizia allenamento
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Focus • Reasoning • Creativity
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
            </div>
          </button>
        </motion.div>

        {/* Training Protocol Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-card/50 border border-border/30 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-foreground">Il tuo protocollo</h2>
            <Link 
              to="/app/account" 
              className="text-[11px] text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Modifica
            </Link>
          </div>

          {hasGoals ? (
            <div className="space-y-3">
              {/* Goal */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Obiettivo</p>
                  <p className="text-[13px] font-medium text-foreground">{getGoalsLabel()}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sessioni</p>
                  <p className="text-[13px] font-medium text-foreground">
                    {getDurationLabel(user?.sessionDuration)} • {getDailyTimeLabel(user?.dailyTimeCommitment)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Sparkles className="w-6 h-6 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-[12px] text-muted-foreground mb-2">Configura il tuo training</p>
              <Link to="/onboarding" className="text-[12px] text-primary hover:underline">
                Completa setup →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Stats or Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center pt-4"
        >
          <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
            Allena il tuo cervello ogni giorno per costruire<br />
            un vantaggio cognitivo duraturo
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Home;
