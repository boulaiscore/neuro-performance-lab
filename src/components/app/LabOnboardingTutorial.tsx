import { useState, useEffect, useRef } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const hasTarget = !!step.targetSelector;

  // Find and track the target element position
  useEffect(() => {
    if (!open || !step.targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      const element = document.querySelector(step.targetSelector!);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    };

    // Initial update
    updateTargetRect();

    // Update on resize/scroll
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    return () => {
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

  // Calculate tooltip position based on target
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const padding = 16;
    const tooltipHeight = 280;
    const viewportHeight = window.innerHeight;
    
    // Position below the target if there's room, otherwise above
    const spaceBelow = viewportHeight - targetRect.bottom;
    const positionBelow = spaceBelow > tooltipHeight + padding;

    return {
      left: "50%",
      transform: "translateX(-50%)",
      top: positionBelow ? targetRect.bottom + padding : undefined,
      bottom: !positionBelow ? viewportHeight - targetRect.top + padding : undefined,
    };
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Overlay with spotlight cutout */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {targetRect && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={targetRect.left - 8}
                    y={targetRect.top - 8}
                    width={targetRect.width + 16}
                    height={targetRect.height + 16}
                    rx="16"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.85)"
              mask="url(#spotlight-mask)"
            />
          </svg>

          {/* Pulsing ring around target */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none"
              style={{
                left: targetRect.left - 8,
                top: targetRect.top - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(var(--primary-rgb), 0.4)",
                    "0 0 0 12px rgba(var(--primary-rgb), 0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-2xl border-2 border-primary"
              />
            </motion.div>
          )}

          {/* Tutorial card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute w-[calc(100%-40px)] max-w-sm px-5"
            style={getTooltipStyle()}
          >
            {/* Skip button */}
            <div className="flex justify-end mb-3">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md"
              >
                Skip
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-2xl">
              {/* Icon + Title row */}
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center relative shrink-0",
                    step.color === "primary" && "bg-primary/15",
                    step.color === "blue-500" && "bg-blue-500/15",
                    step.color === "amber-500" && "bg-amber-500/15",
                    step.color === "emerald-500" && "bg-emerald-500/15"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    step.color === "primary" && "text-primary",
                    step.color === "blue-500" && "text-blue-500",
                    step.color === "amber-500" && "text-amber-500",
                    step.color === "emerald-500" && "text-emerald-500"
                  )} />
                  {step.secondaryIcon && (
                    <step.secondaryIcon className={cn(
                      "w-5 h-5 absolute",
                      step.color === "emerald-500" && "text-emerald-500"
                    )} />
                  )}
                </motion.div>
                <h2 className="text-lg font-bold">{step.title}</h2>
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
                    "flex items-center gap-1.5",
                    "shadow-button"
                  )}
                >
                  {isLastStep ? "Start" : "Next"}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Arrow pointing to target */}
            {hasTarget && targetRect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: getTooltipStyle().top ? -12 : undefined,
                  bottom: getTooltipStyle().bottom ? -12 : undefined,
                }}
              >
                <div 
                  className={cn(
                    "w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent",
                    getTooltipStyle().top 
                      ? "border-b-8 border-b-card" 
                      : "border-t-8 border-t-card"
                  )} 
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}