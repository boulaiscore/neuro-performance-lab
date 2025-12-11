import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, ArrowRight, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onComplete: (result: { score: number; correct: boolean }) => void;
}

// Fixed scenario for Reversal Simulation
const SCENARIO = {
  context: "A small team is preparing an important presentation for a client, but progress keeps stalling. Flip each condition to see what happens when it is reversed, and choose the reversal that would most improve the team's progress.",
  cards: [
    {
      front: "The team never agreed on the main message of the presentation.",
      back: "If reversed: A clear shared message gives everyone direction. Work accelerates sharply. System impact: Very High.",
      isCorrect: true
    },
    {
      front: "People keep multitasking during preparation.",
      back: "If reversed: Everyone focuses only on the presentation. Fewer resets, smoother progress. System impact: High.",
      isCorrect: false
    },
    {
      front: "There are frequent interruptions from unrelated tasks.",
      back: "If reversed: Uninterrupted work blocks stabilize flow. System impact: Medium.",
      isCorrect: false
    },
    {
      front: "The slide template is outdated.",
      back: "If reversed: A modern template boosts motivation but doesn't fix the core issue. System impact: Low.",
      isCorrect: false
    }
  ],
  explanation: "Agreement on the main message changes the structure of the task. It aligns decisions, reduces friction, and accelerates progress much more than removing interruptions or improving aesthetics."
};

export const ReversalSimulationGame = ({ onComplete }: Props) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const resultRef = useRef<{ score: number; correct: boolean } | null>(null);

  const correctIndex = SCENARIO.cards.findIndex(card => card.isCorrect);
  const hasFlippedAtLeastOne = flippedCards.size > 0;

  const handleFlip = (index: number) => {
    if (showResult || isFlipping) return;
    
    setIsFlipping(true);
    
    // 1-second delay for slow-thinking mode
    setTimeout(() => {
      setFlippedCards(prev => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
      setIsFlipping(false);
    }, 1000);
  };

  const handleSelect = (index: number) => {
    if (showResult || !hasFlippedAtLeastOne) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex === null || !hasFlippedAtLeastOne) return;
    setShowResult(true);
    const isCorrect = selectedIndex === correctIndex;
    resultRef.current = { score: isCorrect ? 100 : 0, correct: isCorrect };
  };

  const handleNext = () => {
    if (resultRef.current) {
      onComplete(resultRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <RotateCcw className="w-5 h-5 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Reversal Simulation</span>
        </div>
      </motion.div>

      {/* Context Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm mb-4 p-3 rounded-lg bg-muted/30 border border-border/50"
      >
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-foreground mb-1">Context</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {SCENARIO.context}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
        {SCENARIO.cards.map((card, index) => {
          const isFlipped = flippedCards.has(index);
          const isSelected = selectedIndex === index;
          const isCorrectAndRevealed = showResult && card.isCorrect;
          const isWrongAndSelected = showResult && isSelected && !card.isCorrect;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {/* Card container with proper 3D flip */}
              <div
                className={`relative w-full h-32 cursor-pointer rounded-xl ${
                  isSelected && !showResult ? "ring-2 ring-primary" : ""
                } ${isCorrectAndRevealed ? "ring-2 ring-green-500" : ""}
                  ${isWrongAndSelected ? "ring-2 ring-destructive" : ""}`}
                style={{ perspective: "1000px" }}
                onClick={() => handleFlip(index)}
              >
                {/* Front - visible when not flipped */}
                <motion.div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${
                    isSelected && !showResult
                      ? "bg-primary/20 border-primary"
                      : isCorrectAndRevealed
                      ? "bg-green-500/20 border-green-500"
                      : isWrongAndSelected
                      ? "bg-destructive/20 border-destructive"
                      : "bg-card border-border/50 hover:border-border"
                  }`}
                  initial={false}
                  animate={{ 
                    rotateY: isFlipped ? 180 : 0,
                    opacity: isFlipped ? 0 : 1,
                    zIndex: isFlipped ? 0 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="text-xs text-center text-foreground leading-snug">{card.front}</span>
                  <span className="text-[10px] text-muted-foreground mt-2">Tap to flip</span>
                </motion.div>

                {/* Back - visible when flipped, neutral color */}
                <motion.div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-3 rounded-xl border ${
                    isCorrectAndRevealed
                      ? "bg-green-500/20 border-green-500"
                      : isWrongAndSelected
                      ? "bg-destructive/20 border-destructive"
                      : "bg-muted/80 border-border"
                  }`}
                  initial={false}
                  animate={{ 
                    rotateY: isFlipped ? 0 : -180,
                    opacity: isFlipped ? 1 : 0,
                    zIndex: isFlipped ? 1 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-center">
                    <span className="text-foreground text-[11px] leading-snug">{card.back}</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Select button */}
              {!showResult && (
                <motion.button
                  className={`w-full mt-2 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : !hasFlippedAtLeastOne
                      ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(index);
                  }}
                  disabled={!hasFlippedAtLeastOne}
                >
                  {isSelected ? "Selected" : "Select"}
                </motion.button>
              )}

              {/* Result indicator */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 py-1 rounded-lg text-xs text-center ${
                    card.isCorrect
                      ? "bg-green-500/20 text-green-400"
                      : isSelected
                      ? "bg-destructive/20 text-destructive"
                      : "bg-muted/20 text-muted-foreground"
                  }`}
                >
                  {card.isCorrect ? "✓ Biggest impact" : isSelected ? "✗ Your choice" : ""}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!showResult && !hasFlippedAtLeastOne && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-xs text-center"
        >
          Flip at least one card to explore, then select your answer
        </motion.p>
      )}

      {!showResult && hasFlippedAtLeastOne && selectedIndex === null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-xs text-center"
        >
          Select the reversal with the biggest systemic impact
        </motion.p>
      )}

      {!showResult && selectedIndex !== null && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleConfirm}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          <Check className="w-4 h-4" />
          Confirm Choice
        </motion.button>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 w-full max-w-sm"
          >
            {/* Insight Card */}
            <motion.div 
              className={`p-4 rounded-xl border mb-4 relative overflow-hidden ${
                resultRef.current?.correct 
                  ? "bg-green-500/10 border-green-500/30" 
                  : "bg-destructive/10 border-destructive/30"
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              {resultRef.current?.correct && (
                <motion.div 
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Sparkles className="w-5 h-5 text-green-400" />
                </motion.div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  resultRef.current?.correct ? "bg-green-500" : "bg-destructive"
                }`}>
                  {resultRef.current?.correct ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-xs">✗</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  resultRef.current?.correct ? "text-green-400" : "text-destructive"
                }`}>
                  {resultRef.current?.correct ? "Excellent analysis!" : "Not quite right"}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {SCENARIO.explanation}
              </p>
            </motion.div>

            {/* Next Button */}
            <Button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReversalSimulationGame;
