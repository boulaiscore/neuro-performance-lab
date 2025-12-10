import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DriftField } from "../DriftField";
import { GlowHalo } from "../GlowHalo";
import { PulsingCircle } from "../PulsingCircle";
import { Check, Target, Compass, Shapes, Wind } from "lucide-react";

interface NeuroActivationResult {
  visualStability: number | null;
  alignmentChoice: string | null;
  patternAccuracy: number | null;
  breathCompletion: boolean;
}

interface CompletionScreenProps {
  result: NeuroActivationResult;
}

const ALIGNMENT_LABELS: Record<string, string> = {
  matters: "Focused on Priority",
  progress: "Focused on Progress",
  noise: "Focused on Clarity",
};

export function CompletionScreen({ result }: CompletionScreenProps) {
  const navigate = useNavigate();

  const metrics = [
    {
      icon: Target,
      label: "Focus Stability",
      value: result.visualStability !== null ? `${result.visualStability}%` : "—",
      complete: result.visualStability !== null,
    },
    {
      icon: Compass,
      label: "Alignment Choice",
      value: result.alignmentChoice ? ALIGNMENT_LABELS[result.alignmentChoice] || "Set" : "—",
      complete: result.alignmentChoice !== null,
    },
    {
      icon: Shapes,
      label: "Pattern Responsiveness",
      value: result.patternAccuracy !== null ? `${result.patternAccuracy}%` : "—",
      complete: result.patternAccuracy !== null,
    },
    {
      icon: Wind,
      label: "Breath Completion",
      value: result.breathCompletion ? "Complete" : "—",
      complete: result.breathCompletion,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#06070A]">
      <DriftField particleCount={30} />
      
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <PulsingCircle size={400} />
      </div>
      
      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Success icon */}
        <GlowHalo intensity={0.5} className="mx-auto w-fit mb-8">
          <motion.div
            className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
        </GlowHalo>
        
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-semibold mb-2">Reset Complete</h1>
          <p className="text-sm text-muted-foreground/70">
            Your cognitive state has been primed for strategic clarity
          </p>
        </motion.div>
        
        {/* Metrics */}
        <motion.div
          className="space-y-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/30 border border-border/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metric.complete ? "bg-primary/15" : "bg-muted/20"
              }`}>
                <metric.icon className={`w-5 h-5 ${
                  metric.complete ? "text-primary" : "text-muted-foreground/40"
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground/60">{metric.label}</p>
                <p className={`text-sm font-medium ${
                  metric.complete ? "text-foreground" : "text-muted-foreground/40"
                }`}>
                  {metric.value}
                </p>
              </div>
              {metric.complete && (
                <motion.div
                  className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                >
                  <Check className="w-3 h-3 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Button */}
        <motion.button
          onClick={() => navigate("/app")}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: "0 0 40px hsl(var(--primary) / 0.3)",
          }}
        >
          Start Your Day with Clarity
        </motion.button>
        
        {/* Footer */}
        <motion.p
          className="mt-6 text-[10px] text-muted-foreground/40 text-center uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Strategic Cognitive Performance
        </motion.p>
      </motion.div>
    </div>
  );
}
