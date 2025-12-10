import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { PulsingCircle } from "../PulsingCircle";
import { DriftField } from "../DriftField";
import { StepIndicator } from "../StepContainer";

interface VisualStabilityModuleProps {
  duration: number;
  onComplete: (stability: number) => void;
}

interface Distractor {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function VisualStabilityModule({ duration, onComplete }: VisualStabilityModuleProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [distractors, setDistractors] = useState<Distractor[]>([]);
  const [stabilityScore, setStabilityScore] = useState(100);
  const [focusBreaks, setFocusBreaks] = useState(0);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(Math.max(0, stabilityScore - focusBreaks * 5));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, onComplete, stabilityScore, focusBreaks]);

  // Generate distractors
  useEffect(() => {
    const generateDistractor = () => {
      const edges = ['top', 'bottom', 'left', 'right'];
      const edge = edges[Math.floor(Math.random() * edges.length)];
      
      let x, y;
      switch (edge) {
        case 'top':
          x = Math.random() * 80 + 10;
          y = 5;
          break;
        case 'bottom':
          x = Math.random() * 80 + 10;
          y = 95;
          break;
        case 'left':
          x = 5;
          y = Math.random() * 80 + 10;
          break;
        default:
          x = 95;
          y = Math.random() * 80 + 10;
      }

      const newDistractor: Distractor = {
        id: Date.now(),
        x,
        y,
        size: Math.random() * 8 + 4,
      };

      setDistractors(prev => [...prev, newDistractor]);

      setTimeout(() => {
        setDistractors(prev => prev.filter(d => d.id !== newDistractor.id));
      }, 2000);
    };

    const interval = setInterval(generateDistractor, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleDistractorClick = useCallback(() => {
    setFocusBreaks(prev => prev + 1);
    setStabilityScore(prev => Math.max(0, prev - 5));
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#06070A]">
      <DriftField particleCount={15} />
      
      {/* Header */}
      <div className="absolute top-6 left-0 right-0 px-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Module 1 of 4
          </span>
          <span className="text-sm font-mono text-primary">{formatTime(timeLeft)}</span>
        </div>
        <StepIndicator totalSteps={4} currentStep={0} />
      </div>
      
      {/* Title */}
      <motion.div
        className="absolute top-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-1">Visual Stability</h2>
        <p className="text-xs text-muted-foreground/70">
          Maintain visual focus. Ignore peripheral noise.
        </p>
      </motion.div>
      
      {/* Main focus circle */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <PulsingCircle size={220} />
        
        {/* Center instruction */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] text-primary/60 uppercase tracking-widest">
            Focus Here
          </span>
        </div>
      </motion.div>
      
      {/* Distractors */}
      <AnimatePresence>
        {distractors.map(distractor => (
          <motion.div
            key={distractor.id}
            className="absolute rounded-full cursor-pointer"
            style={{
              left: `${distractor.x}%`,
              top: `${distractor.y}%`,
              width: distractor.size,
              height: distractor.size,
              background: "hsl(var(--muted-foreground) / 0.3)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDistractorClick}
          />
        ))}
      </AnimatePresence>
      
      {/* Stability indicator */}
      <motion.div
        className="absolute bottom-24 w-full px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mb-2">
          <span>Stability</span>
          <span>{stabilityScore}%</span>
        </div>
        <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: `${stabilityScore}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
