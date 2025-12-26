import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRAINING_PLANS, TrainingPlanId, SessionConfig } from "@/lib/trainingPlans";
import { Check, Zap, Brain, Sparkles } from "lucide-react";

interface WeeklyScheduleProps {
  planId: TrainingPlanId;
  className?: string;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Map sessions to days of the week (3 sessions spread across the week)
const SESSION_DAYS: Record<TrainingPlanId, number[]> = {
  light: [0, 2, 4],      // Mon, Wed, Fri
  expert: [0, 2, 4],     // Mon, Wed, Fri  
  superhuman: [1, 3, 5], // Tue, Thu, Sat
};

const getSessionIcon = (session: SessionConfig) => {
  if (session.thinkingSystems.length === 2) {
    return Sparkles; // Dual process
  }
  if (session.thinkingSystems.includes("S1")) {
    return Zap; // Fast thinking
  }
  return Brain; // Slow thinking
};

const getSessionColor = (session: SessionConfig) => {
  if (session.thinkingSystems.length === 2) {
    return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
  }
  if (session.thinkingSystems.includes("S1")) {
    return "from-amber-500/20 to-amber-600/20 border-amber-500/30";
  }
  return "from-teal-500/20 to-teal-600/20 border-teal-500/30";
};

export function WeeklySchedule({ planId, className }: WeeklyScheduleProps) {
  const plan = TRAINING_PLANS[planId];
  const sessionDays = SESSION_DAYS[planId];
  
  // Get current day of week (0 = Monday in our system)
  const currentDayIndex = useMemo(() => {
    const jsDay = new Date().getDay(); // 0 = Sunday
    return jsDay === 0 ? 6 : jsDay - 1; // Convert to 0 = Monday
  }, []);

  const getSessionForDay = (dayIndex: number): SessionConfig | null => {
    const sessionIndex = sessionDays.indexOf(dayIndex);
    if (sessionIndex === -1) return null;
    return plan.sessions[sessionIndex] || null;
  };

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
          Weekly Schedule
        </h3>
        <span className="text-[11px] text-muted-foreground/70">
          {plan.sessionsPerWeek} sessions • {plan.sessionDuration}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label, index) => {
          const session = getSessionForDay(index);
          const isToday = index === currentDayIndex;
          const SessionIcon = session ? getSessionIcon(session) : null;
          
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex flex-col items-center"
            >
              {/* Day label */}
              <span className={cn(
                "text-[9px] font-medium mb-1.5 uppercase tracking-wide",
                isToday ? "text-primary" : "text-muted-foreground/60"
              )}>
                {label}
              </span>
              
              {/* Day circle */}
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center relative transition-all",
                session 
                  ? cn("bg-gradient-to-br border", getSessionColor(session))
                  : "bg-muted/20 border border-border/20",
                isToday && "ring-2 ring-primary/50 ring-offset-1 ring-offset-background"
              )}>
                {session && SessionIcon ? (
                  <SessionIcon className={cn(
                    "w-4 h-4",
                    session.thinkingSystems.length === 2 
                      ? "text-purple-400" 
                      : session.thinkingSystems.includes("S1") 
                        ? "text-amber-400" 
                        : "text-teal-400"
                  )} />
                ) : (
                  <span className="text-[10px] text-muted-foreground/40">—</span>
                )}
              </div>
              
              {/* Session name (only for session days) */}
              {session && (
                <span className="text-[8px] text-muted-foreground/70 mt-1 text-center leading-tight max-w-[40px] truncate">
                  {session.name.split(" ")[0]}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <span className="text-[9px] text-muted-foreground">S1 Fast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50" />
          <span className="text-[9px] text-muted-foreground">S2 Slow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500/50" />
          <span className="text-[9px] text-muted-foreground">Dual</span>
        </div>
      </div>
    </div>
  );
}
