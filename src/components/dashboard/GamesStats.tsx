import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNeuroLabSessions, useNeuroLabWeeklyStats } from "@/hooks/useNeuroLab";
import { Gamepad2, Target, TrendingUp, Zap, Brain, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const AREA_CONFIG: Record<string, { label: string; icon: typeof Target; color: string }> = {
  focus: { label: "Focus", icon: Target, color: "text-blue-400" },
  memory: { label: "Memory", icon: Brain, color: "text-purple-400" },
  control: { label: "Control", icon: Zap, color: "text-amber-400" },
  reasoning: { label: "Reasoning", icon: Lightbulb, color: "text-teal-400" },
  creativity: { label: "Creativity", icon: Sparkles, color: "text-pink-400" },
};

export function GamesStats() {
  const { user } = useAuth();
  const { data: sessions = [], isLoading: sessionsLoading } = useNeuroLabSessions(user?.id);
  const { data: weeklyStats, isLoading: statsLoading } = useNeuroLabWeeklyStats(user?.id);

  const stats = useMemo(() => {
    if (!sessions.length) return null;

    // Last 7 days sessions
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSessions = sessions.filter(
      s => new Date(s.completed_at) >= sevenDaysAgo
    );

    // Calculate averages
    const avgScore = recentSessions.length > 0
      ? Math.round(recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) / recentSessions.length)
      : 0;

    const totalCorrect = recentSessions.reduce((sum, s) => sum + (s.correct_answers || 0), 0);
    const totalQuestions = recentSessions.reduce((sum, s) => sum + (s.total_questions || 0), 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Most trained area
    const areaCounts = recentSessions.reduce((acc, s) => {
      const area = s.area as string;
      if (area && area !== "neuro-activation") {
        acc[area] = (acc[area] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalSessions: recentSessions.length,
      avgScore,
      accuracy,
      topArea: topArea ? { area: topArea[0], count: topArea[1] } : null,
    };
  }, [sessions]);

  const isLoading = sessionsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-card/40 border border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading games...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-card/50 to-purple-500/5 border border-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-blue-400" />
            <h3 className="text-[13px] font-semibold">Weekly Games</h3>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-400">{stats?.totalSessions || 0}</span>
            <span className="text-[10px] text-muted-foreground ml-1">sessions</span>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && stats.totalSessions > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {/* Avg Score */}
            <div className="p-2.5 rounded-lg bg-card/50 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3 w-3 text-primary/60" />
                <span className="text-[9px] text-muted-foreground uppercase">Avg Score</span>
              </div>
              <p className="text-sm font-semibold">{stats.avgScore}%</p>
            </div>

            {/* Accuracy */}
            <div className="p-2.5 rounded-lg bg-card/50 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="h-3 w-3 text-green-500/60" />
                <span className="text-[9px] text-muted-foreground uppercase">Accuracy</span>
              </div>
              <p className="text-sm font-semibold">{stats.accuracy}%</p>
            </div>

            {/* Top Area */}
            <div className="p-2.5 rounded-lg bg-card/50 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-3 w-3 text-amber-500/60" />
                <span className="text-[9px] text-muted-foreground uppercase">Top Area</span>
              </div>
              {stats.topArea ? (
                <p className="text-sm font-semibold capitalize">{stats.topArea.area}</p>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground">No games played this week</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Start training to see your stats</p>
          </div>
        )}
      </div>

      {/* Area Breakdown */}
      {weeklyStats && Object.values(weeklyStats).some(v => v > 0) && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-1">
            Areas Trained
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(AREA_CONFIG).map(([areaId, config]) => {
              const count = weeklyStats[areaId as keyof typeof weeklyStats] || 0;
              if (count === 0) return null;
              
              const Icon = config.icon;
              return (
                <div
                  key={areaId}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-card/40 border border-border/20"
                >
                  <div className={cn("w-7 h-7 rounded-md bg-muted/30 flex items-center justify-center")}>
                    <Icon className={cn("h-3.5 w-3.5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{config.label}</p>
                    <p className="text-[10px] text-muted-foreground">{count} session{count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
