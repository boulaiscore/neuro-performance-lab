import { motion } from "framer-motion";
import { PulsingCircle } from "../PulsingCircle";
import { DriftField } from "../DriftField";
import { GlowHalo } from "../GlowHalo";
import { StepIndicator } from "../StepContainer";
import { Zap } from "lucide-react";

interface IntroScreenProps {
  onBegin: () => void;
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[#06070A]">
      <DriftField particleCount={25} />
      
      {/* Background geometric pulse */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <PulsingCircle size={350} />
      </div>
      
      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Icon */}
        <GlowHalo intensity={0.4}>
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-8">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </GlowHalo>
        
        {/* Title */}
        <motion.h1 
          className="text-2xl font-semibold tracking-tight text-foreground mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Neuro Activation
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-sm text-muted-foreground/80 leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A five-minute cognitive warm-up to activate clarity, focus, and strategic thinking.
        </motion.p>
        
        {/* Duration indicator */}
        <motion.div 
          className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">5 MIN</span>
          <span>•</span>
          <span>4 Modules</span>
        </motion.div>
        
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <StepIndicator totalSteps={4} currentStep={-1} />
        </motion.div>
        
        {/* Begin button */}
        <motion.button
          onClick={onBegin}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: "0 0 40px hsl(var(--primary) / 0.3)",
          }}
        >
          Begin Reset
        </motion.button>
        
        {/* Footer note */}
        <motion.p
          className="mt-6 text-[10px] text-muted-foreground/40 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Strategic Cognitive Performance
        </motion.p>
      </motion.div>
    </div>
  );
}
