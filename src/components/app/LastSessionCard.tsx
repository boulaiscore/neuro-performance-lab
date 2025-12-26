import { motion } from "framer-motion";
import { Clock, Target, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface LastSessionCardProps {
  area: string;
  score: number;
  durationOption: string;
  completedAt: string;
}

const AREA_LABELS: Record<string, string> = {
  focus: "Focus",
  reasoning: "Reasoning",
  creativity: "Creativity",
  memory: "Memory",
};

export function LastSessionCard({ area, score, durationOption, completedAt }: LastSessionCardProps) {
  const areaLabel = AREA_LABELS[area] || area;
  const timeAgo = formatDistanceToNow(new Date(completedAt), { addSuffix: true });

  const scoreColor =
    score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/40"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">{areaLabel} Session</p>
          <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">{durationOption}</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className={cn("text-sm font-semibold", scoreColor)}>{score}%</span>
        </div>
      </div>
    </motion.div>
  );
}
