import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DriftField } from "../DriftField";
import { RippleTapArea } from "../RippleTapArea";
import { GlowHalo } from "../GlowHalo";
import { StepIndicator } from "../StepContainer";

interface CognitiveAlignmentModuleProps {
  duration: number;
  onComplete: (choice: string | null) => void;
}

const ALIGNMENT_STATEMENTS = [
  { id: "matters", text: "What matters most today?", subtext: "Identify your primary focus" },
  { id: "progress", text: "What creates progress?", subtext: "Define meaningful action" },
  { id: "noise", text: "What is noise?", subtext: "Recognize distractions" },
];

export function CognitiveAlignmentModule({ duration, onComplete }: CognitiveAlignmentModuleProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(selectedChoice);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [duration, onComplete, selectedChoice]);

  const handleSelect = (id: string) => {
    if (selectedChoice) return;
    setSelectedChoice(id);
    
    // Auto-advance after selection
    setTimeout(() => {
      onComplete(id);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-10 bg-[#06070A]">
      <DriftField particleCount={20} />
      
      {/* Header */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Module 2 of 4
          </span>
          <span className="text-sm font-mono text-primary">{formatTime(timeLeft)}</span>
        </div>
        <StepIndicator totalSteps={4} currentStep={1} />
      </div>
      
      {/* Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-1">Cognitive Alignment</h2>
        <p className="text-xs text-muted-foreground/70">
          Select what resonates with your current focus
        </p>
      </motion.div>
      
      {/* Statement Cards */}
      <div className="flex-1 w-full max-w-sm flex flex-col justify-center gap-4">
        {ALIGNMENT_STATEMENTS.map((statement, index) => {
          const isSelected = selectedChoice === statement.id;
          
          return (
            <motion.div
              key={statement.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: selectedChoice && !isSelected ? (index - 1) * 5 : 0,
              }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
            >
              <RippleTapArea
                onTap={() => handleSelect(statement.id)}
                disabled={!!selectedChoice}
                className="rounded-xl"
              >
                <GlowHalo intensity={isSelected ? 0.5 : 0} color="hsl(var(--primary))">
                  <motion.div
                    className={`
                      p-5 rounded-xl border transition-all duration-300
                      ${isSelected 
                        ? "bg-primary/15 border-primary/40" 
                        : "bg-card/30 border-border/30 hover:border-primary/30 hover:bg-card/50"
                      }
                      ${selectedChoice && !isSelected ? "opacity-30 scale-95" : ""}
                    `}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-sm font-medium mb-1">{statement.text}</h3>
                    <p className="text-[11px] text-muted-foreground/60">{statement.subtext}</p>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        className="mt-3 flex items-center gap-2"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-[10px] text-primary uppercase tracking-wider">
                          Selected
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                </GlowHalo>
              </RippleTapArea>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer hint */}
      <motion.p
        className="text-[10px] text-muted-foreground/40 text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Tap a card to set your cognitive anchor
      </motion.p>
    </div>
  );
}
