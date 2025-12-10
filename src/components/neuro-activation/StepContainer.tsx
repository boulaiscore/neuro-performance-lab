import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface StepContainerProps {
  children: ReactNode;
  stepKey: string | number;
  className?: string;
}

export function StepContainer({ children, stepKey, className = "" }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        className={`w-full h-full ${className}`}
        initial={{ 
          opacity: 0, 
          scale: 0.985, 
          y: 20,
          filter: "blur(4px)"
        }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          filter: "blur(0px)"
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.98, 
          filter: "blur(4px)"
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1] 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Step indicator component
interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function StepIndicator({ totalSteps, currentStep, className = "" }: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full"
          initial={false}
          animate={{
            width: i === currentStep ? 24 : 8,
            backgroundColor: i <= currentStep 
              ? "hsl(var(--primary))" 
              : "hsl(var(--muted-foreground) / 0.2)",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
