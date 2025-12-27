import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Gamepad2, BookMarked, Target } from "lucide-react";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { XPCelebration } from "@/components/app/XPCelebration";

export function WeeklyGoalCard() {
  const { 
    weeklyXPEarned, 
    weeklyXPTarget, 
    weeklyGamesXP, 
    weeklyContentXP,
    sessionsCompleted,
    sessionsRequired,
    plan 
  } = useWeeklyProgress();
  const [showCelebration, setShowCelebration] = useState(false);
  const prevGoalReached = useRef(false);

  const xpProgress = Math.min(100, (weeklyXPEarned / weeklyXPTarget) * 100);
  const xpRemaining = Math.max(0, weeklyXPTarget - weeklyXPEarned);
  const goalReached = weeklyXPEarned >= weeklyXPTarget && weeklyXPTarget > 0;

  // Estimate activities needed (avg 15 XP per activity)
  const activitiesNeeded = Math.ceil(xpRemaining / 15);

  // Content required per week from plan
  const contentRequired = plan.contentPerWeek;

  // Trigger celebration when goal is reached for the first time
  useEffect(() => {
    if (goalReached && !prevGoalReached.current) {
      setShowCelebration(true);
    }
    prevGoalReached.current = goalReached;
  }, [goalReached]);

  return (
    <>
      <XPCelebration 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)}
      />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-[12px] font-semibold">Weekly Goal</span>
          </div>
          <span className="text-[12px] font-bold text-amber-400">
            {weeklyXPEarned} / {weeklyXPTarget} XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="h-2 bg-amber-500/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Plan Requirements - Clear breakdown */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/30 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
              {plan.name} Target
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
                <Gamepad2 className="w-3 h-3 text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">
                  {sessionsCompleted}/{sessionsRequired} sessions
                </p>
                <p className="text-[9px] text-muted-foreground">Games</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-500/15 flex items-center justify-center">
                <BookMarked className="w-3 h-3 text-purple-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">
                  {contentRequired} / week
                </p>
                <p className="text-[9px] text-muted-foreground">Tasks</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* XP Breakdown */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-muted-foreground">
              Games: <span className="text-blue-400 font-medium">{weeklyGamesXP} XP</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-[10px] text-muted-foreground">
              Tasks: <span className="text-purple-400 font-medium">{weeklyContentXP} XP</span>
            </span>
          </div>
        </div>
        
        {xpRemaining > 0 ? (
          <p className="text-[10px] text-muted-foreground">
            ~<span className="text-amber-400 font-medium">{activitiesNeeded} activit{activitiesNeeded > 1 ? 'ies' : 'y'}</span> to reach weekly target
          </p>
        ) : (
          <p className="text-[10px] text-emerald-400 font-medium">
            Weekly goal achieved! Keep training to level up faster.
          </p>
        )}
      </motion.div>
    </>
  );
}
