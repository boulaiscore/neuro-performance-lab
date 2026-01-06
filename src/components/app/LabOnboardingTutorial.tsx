import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, BookMarked, Smartphone, Ban, X, ChevronRight, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LabOnboardingTutorialProps {
  open: boolean;
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    id: "welcome",
    title: "Welcome to the Lab",
    description: "Your cognitive training hub. Here you'll find everything you need to sharpen your mind and build lasting mental performance.",
    icon: Brain,
    color: "primary",
  },
  {
    id: "neuro-activation",
    title: "Neuro Activation",
    description: "Start with a 5-minute warm-up protocol to prime your brain for peak performance. Recommended before any training session.",
    icon: Zap,
    color: "primary",
  },
  {
    id: "games",
    title: "Cognitive Games",
    description: "Active training through engaging games that target Focus, Reasoning, and Creativity. Each session adapts to your skill level.",
    icon: Gamepad2,
    color: "blue-500",
  },
  {
    id: "tasks",
    title: "Learning Tasks",
    description: "Passive training through curated podcasts, books, and articles. Absorb knowledge that enhances your cognitive toolkit.",
    icon: BookMarked,
    color: "amber-500",
  },
  {
    id: "detox",
    title: "Digital Detox",
    description: "Challenge yourself to reduce screen time and reclaim your attention. Earn XP for completing detox sessions.",
    icon: Smartphone,
    color: "emerald-500",
    secondaryIcon: Ban,
  },
];

export function LabOnboardingTutorial({ open, onComplete }: LabOnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

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

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            {/* Skip button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tutorial
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center relative",
                    step.color === "primary" && "bg-primary/15",
                    step.color === "blue-500" && "bg-blue-500/15",
                    step.color === "amber-500" && "bg-amber-500/15",
                    step.color === "emerald-500" && "bg-emerald-500/15"
                  )}
                >
                  <Icon className={cn(
                    "w-8 h-8",
                    step.color === "primary" && "text-primary",
                    step.color === "blue-500" && "text-blue-500",
                    step.color === "amber-500" && "text-amber-500",
                    step.color === "emerald-500" && "text-emerald-500"
                  )} />
                  {step.secondaryIcon && (
                    <step.secondaryIcon className={cn(
                      "w-8 h-8 absolute",
                      step.color === "emerald-500" && "text-emerald-500"
                    )} />
                  )}
                </motion.div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mb-6">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentStep 
                        ? "bg-primary w-6" 
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
                  "w-full py-3.5 rounded-xl font-semibold text-sm",
                  "bg-primary text-primary-foreground",
                  "flex items-center justify-center gap-2",
                  "shadow-button"
                )}
              >
                {isLastStep ? "Get Started" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}