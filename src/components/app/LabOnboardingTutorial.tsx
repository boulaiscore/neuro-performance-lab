import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, BookMarked, Smartphone, Ban, X, ChevronRight, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LabOnboardingTutorialProps {
  open: boolean;
  onComplete: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  targetSelector?: string;
  secondaryIcon?: React.ElementType;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Lab",
    description: "Your cognitive training hub. Here you'll find everything you need to sharpen your mind.",
    icon: Brain,
    color: "primary",
  },
  {
    id: "neuro-activation",
    title: "Neuro Activation",
    description: "Start with a 5-minute warm-up protocol to prime your brain for peak performance.",
    icon: Zap,
    color: "primary",
    targetSelector: "[data-tutorial='neuro-activation']",
  },
  {
    id: "games",
    title: "Cognitive Games",
    description: "Active training through engaging games that target Focus, Reasoning, and Creativity.",
    icon: Gamepad2,
    color: "blue-500",
    targetSelector: "[data-tutorial='games-tab']",
  },
  {
    id: "tasks",
    title: "Learning Tasks",
    description: "Passive training through curated podcasts, books, and articles.",
    icon: BookMarked,
    color: "amber-500",
    targetSelector: "[data-tutorial='tasks-tab']",
  },
  {
    id: "detox",
    title: "Digital Detox",
    description: "Challenge yourself to reduce screen time and reclaim your attention.",
    icon: Smartphone,
    color: "emerald-500",
    targetSelector: "[data-tutorial='detox-tab']",
    secondaryIcon: Ban,
  },
];

export function LabOnboardingTutorial({ open, onComplete }: LabOnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  // Reset step when opening
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  // Find and track the target element position
  useEffect(() => {
    if (!open || !step.targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      const element = document.querySelector(step.targetSelector!);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Clamp values to ensure spotlight stays visible on screen
        const clampedRect = {
          left: Math.max(8, rect.left),
          top: Math.max(8, rect.top),
          width: Math.min(rect.width, window.innerWidth - 16),
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom,
          x: rect.x,
          y: rect.y,
          toJSON: rect.toJSON,
        } as DOMRect;
        setTargetRect(clampedRect);
      }
    };

    // Initial update with small delay to ensure DOM is ready
    const timeout = setTimeout(updateTargetRect, 100);

    // Update on resize/scroll
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [open, step.targetSelector, currentStep]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "blue-500": return "text-blue-500";
      case "amber-500": return "text-amber-500";
      case "emerald-500": return "text-emerald-500";
      default: return "text-primary";
    }
  };

  const getIconBg = (color: string) => {
    switch (color) {
      case "primary": return "bg-primary/15";
      case "blue-500": return "bg-blue-500/15";
      case "amber-500": return "bg-amber-500/15";
      case "emerald-500": return "bg-emerald-500/15";
      default: return "bg-primary/15";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Spotlight cutout for target element */}
          {targetRect && (
            <>
              {/* Highlight box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bg-background rounded-xl pointer-events-none"
                style={{
                  left: Math.max(4, targetRect.left - 6),
                  top: Math.max(4, targetRect.top - 6),
                  width: Math.min(targetRect.width + 12, window.innerWidth - 8),
                  height: targetRect.height + 12,
                }}
              />
              {/* Pulsing ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute pointer-events-none"
                style={{
                  left: Math.max(4, targetRect.left - 6),
                  top: Math.max(4, targetRect.top - 6),
                  width: Math.min(targetRect.width + 12, window.innerWidth - 8),
                  height: targetRect.height + 12,
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 hsl(var(--primary) / 0.4)",
                      "0 0 0 8px hsl(var(--primary) / 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-xl border-2 border-primary"
                />
              </motion.div>
            </>
          )}

          {/* Tutorial card - fixed at bottom, full width on mobile */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          >
            {/* Card */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl mx-auto max-w-md">
              {/* Header with skip */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-muted-foreground">
                  {currentStep + 1} / {TUTORIAL_STEPS.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors -mt-0.5"
                >
                  Skip
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Icon + Title row */}
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center relative shrink-0",
                    getIconBg(step.color)
                  )}
                >
                  <Icon className={cn("w-5 h-5", getIconColor(step.color))} />
                  {step.secondaryIcon && (
                    <step.secondaryIcon className={cn(
                      "w-5 h-5 absolute",
                      getIconColor(step.color)
                    )} />
                  )}
                </motion.div>
                <h2 className="text-base font-bold leading-tight">{step.title}</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Progress + Next */}
              <div className="flex items-center justify-between">
                {/* Progress dots */}
                <div className="flex gap-1.5">
                  {TUTORIAL_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === currentStep 
                          ? "bg-primary w-5" 
                          : index < currentStep 
                            ? "bg-primary/50" 
                            : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                {/* Next button */}
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "py-2.5 px-5 rounded-xl font-semibold text-sm",
                    "bg-primary text-primary-foreground",
                    "flex items-center gap-1.5"
                  )}
                >
                  {isLastStep ? "Start" : "Next"}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}