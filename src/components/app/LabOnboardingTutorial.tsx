import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, BookMarked, Smartphone, Ban, X, ChevronRight, Zap, Brain, ChevronLeft } from "lucide-react";
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
  hint: string;
  secondaryIcon?: React.ElementType;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Your Mission: Earn XP",
    description: "Complete games, tasks, and detox challenges to earn XP. Hit your weekly goal to level up your cognitive performance.",
    icon: Brain,
    color: "primary",
    hint: "🎯 Weekly goal = Progress bar at the top",
  },
  {
    id: "neuro-activation",
    title: "1. Warm Up First",
    description: "Tap this button before training. A 5-minute protocol that primes your brain for better performance.",
    icon: Zap,
    color: "primary",
    hint: "Earns XP + boosts your session results",
  },
  {
    id: "games",
    title: "2. Play Cognitive Games",
    description: "Pick Focus, Reasoning, or Creativity games. Each completed game earns XP based on difficulty and score.",
    icon: Gamepad2,
    color: "blue-500",
    hint: "🕹️ Harder games = More XP",
  },
  {
    id: "tasks",
    title: "3. Learn with Content",
    description: "Listen to podcasts, read articles, or study books. Mark them complete to earn passive XP.",
    icon: BookMarked,
    color: "amber-500",
    hint: "📚 Great for commute or downtime",
  },
  {
    id: "detox",
    title: "4. Digital Detox Challenge",
    description: "Lock distracting apps for a set time. Survive without breaking = big XP bonus!",
    icon: Smartphone,
    color: "emerald-500",
    hint: "📵 15min = easy, 60min = big reward",
    secondaryIcon: Ban,
  },
];

export function LabOnboardingTutorial({ open, onComplete }: LabOnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            key={step.id}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <span className="text-xs font-medium text-muted-foreground">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </span>
              <button
                onClick={handleSkip}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="flex justify-center mb-5"
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center relative",
                  getIconBg(step.color)
                )}>
                  <Icon className={cn("w-10 h-10", getIconColor(step.color))} />
                  {step.secondaryIcon && (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -right-1 -bottom-1 w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center"
                    >
                      <step.secondaryIcon className={cn("w-4 h-4", getIconColor(step.color))} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <h2 className="text-xl font-bold text-center mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground text-center leading-relaxed mb-4">
                {step.description}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "mx-auto w-fit px-3 py-1.5 rounded-full text-xs font-medium",
                  getIconBg(step.color),
                  getIconColor(step.color)
                )}
              >
                💡 {step.hint}
              </motion.div>
            </div>

            <div className="px-5 pb-5">
              <div className="flex justify-center gap-1.5 mb-4">
                {TUTORIAL_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentStep 
                        ? "bg-primary w-6" 
                        : index < currentStep 
                          ? "bg-primary/50 w-2" 
                          : "bg-muted-foreground/30 w-2"
                    )}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {!isFirstStep && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handlePrev}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-muted text-muted-foreground flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                )}
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-semibold text-sm",
                    "bg-primary text-primary-foreground",
                    "flex items-center justify-center gap-1.5",
                    isFirstStep && "w-full"
                  )}
                >
                  {isLastStep ? "Let's Go!" : "Next"}
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