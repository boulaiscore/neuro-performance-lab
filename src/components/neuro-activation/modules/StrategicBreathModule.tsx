import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DriftField } from "../DriftField";
import { GlowHalo } from "../GlowHalo";
import { StepIndicator } from "../StepContainer";

interface StrategicBreathModuleProps {
  duration: number;
  onComplete: (completed: boolean) => void;
}

const STRATEGIC_CUES = [
  "Zoom Out.",
  "Reduce Noise.",
  "Act With Clarity.",
  "Think Long-Term.",
  "Focus on Signal.",
  "Execute With Precision.",
];

export function StrategicBreathModule({ duration, onComplete }: StrategicBreathModuleProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, onComplete]);

  // Breathing cycle (7s total: 3s inhale, 1s hold, 3s exhale)
  useEffect(() => {
    const breathCycle = () => {
      // Inhale
      setBreathPhase('inhale');
      setTimeout(() => {
        // Hold
        setBreathPhase('hold');
        setTimeout(() => {
          // Exhale
          setBreathPhase('exhale');
          setCycleCount(prev => prev + 1);
        }, 1000);
      }, 3000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 7000);
    return () => clearInterval(interval);
  }, []);

  // Update cue every cycle
  useEffect(() => {
    setCurrentCueIndex(cycleCount % STRATEGIC_CUES.length);
  }, [cycleCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-10 bg-[#06070A]">
      <DriftField particleCount={20} />
      
      {/* Header */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Module 4 of 4
          </span>
          <span className="text-sm font-mono text-primary">{formatTime(timeLeft)}</span>
        </div>
        <StepIndicator totalSteps={4} currentStep={3} />
      </div>
      
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold mb-1">Strategic Breath</h2>
        <p className="text-xs text-muted-foreground/70">
          Align breathing with strategic clarity
        </p>
      </motion.div>
      
      {/* Breathing Geometry */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <GlowHalo intensity={0.4} color="hsl(var(--primary))">
          <motion.div
            className="relative border-2 border-primary/50"
            animate={{
              width: breathPhase === 'inhale' ? 180 : breathPhase === 'hold' ? 180 : 120,
              height: breathPhase === 'inhale' ? 180 : breathPhase === 'hold' ? 180 : 120,
              borderRadius: breathPhase === 'hold' ? '8px' : '16px',
            }}
            transition={{
              duration: breathPhase === 'hold' ? 0.2 : 3,
              ease: [0.45, 0, 0.55, 1],
            }}
            style={{
              background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent)',
              boxShadow: '0 0 60px hsl(var(--primary) / 0.2)',
            }}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-4 rounded-lg"
              animate={{
                opacity: breathPhase === 'inhale' ? 0.4 : 0.15,
              }}
              transition={{ duration: 3, ease: "easeInOut" }}
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent)',
              }}
            />
          </motion.div>
        </GlowHalo>
        
        {/* Breath instruction */}
        <motion.div
          className="mt-8 text-center"
          key={breathPhase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
            {getBreathText()}
          </span>
        </motion.div>
        
        {/* Strategic Cue */}
        <motion.div
          className="mt-10 text-center"
          key={currentCueIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold text-primary tracking-tight">
            {STRATEGIC_CUES[currentCueIndex]}
          </p>
        </motion.div>
      </div>
      
      {/* Cycle indicator */}
      <div className="flex items-center gap-2 mt-6">
        {Array.from({ length: Math.min(cycleCount + 1, 10) }, (_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: i <= cycleCount ? 1 : 0.3, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      
      {/* No interaction hint */}
      <p className="text-[10px] text-muted-foreground/40 text-center mt-6">
        No interaction required — focus on breath
      </p>
    </div>
  );
}
