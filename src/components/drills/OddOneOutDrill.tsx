import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OddOneOutDrillProps {
  config: {
    trialsCount: number;
    timePerTrial: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  timeLimit: number;
  onComplete: (result: { score: number; correct: number; avgReactionTime: number }) => void;
}

type ItemSet = {
  items: string[];
  oddIndex: number;
  category: string;
};

const ITEM_SETS: ItemSet[] = [
  { items: ["🍎", "🍊", "🍋", "🚗"], oddIndex: 3, category: "fruits" },
  { items: ["🐕", "🐈", "🐁", "🌳"], oddIndex: 3, category: "animals" },
  { items: ["⬛", "⬛", "⬛", "⬜"], oddIndex: 3, category: "colors" },
  { items: ["2", "4", "6", "9"], oddIndex: 3, category: "even numbers" },
  { items: ["🔵", "🔵", "🔴", "🔵"], oddIndex: 2, category: "circles" },
  { items: ["△", "△", "△", "□"], oddIndex: 3, category: "shapes" },
  { items: ["A", "E", "I", "B"], oddIndex: 3, category: "vowels" },
  { items: ["🌞", "🌙", "⭐", "🎸"], oddIndex: 3, category: "sky" },
  { items: ["1", "3", "5", "8"], oddIndex: 3, category: "odd numbers" },
  { items: ["🔺", "🔺", "🔻", "🔺"], oddIndex: 2, category: "triangles" },
  { items: ["🏠", "🏢", "🏰", "🌺"], oddIndex: 3, category: "buildings" },
  { items: ["✈️", "🚗", "🚢", "📚"], oddIndex: 3, category: "transport" },
];

export function OddOneOutDrill({ config, timeLimit, onComplete }: OddOneOutDrillProps) {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [trialStartTime, setTrialStartTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentSet, setCurrentSet] = useState<ItemSet | null>(null);
  const [usedSets, setUsedSets] = useState<number[]>([]);

  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Generate new trial
  const generateTrial = () => {
    const availableIndices = ITEM_SETS.map((_, i) => i).filter(i => !usedSets.includes(i));
    if (availableIndices.length === 0) {
      setUsedSets([]);
      const randomIndex = Math.floor(Math.random() * ITEM_SETS.length);
      return ITEM_SETS[randomIndex];
    }
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedSets(prev => [...prev, randomIndex]);
    return ITEM_SETS[randomIndex];
  };

  // Initialize first trial
  useEffect(() => {
    setCurrentSet(generateTrial());
    setTrialStartTime(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  // Complete
  useEffect(() => {
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const avgReactionTime = reactionTimes.length > 0 
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
        : 0;
      onCompleteRef.current({ score, correct, avgReactionTime });
    }
  }, [isComplete, score, correct, reactionTimes]);

  const handleSelect = (index: number) => {
    if (feedback || !currentSet) return;

    const reactionTime = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);

    if (index === currentSet.oddIndex) {
      setFeedback("correct");
      setCorrect(prev => prev + 1);
      setScore(prev => prev + Math.max(100 - Math.floor(reactionTime / 50), 10));
    } else {
      setFeedback("wrong");
    }

    setTimeout(() => {
      if (currentTrial + 1 >= config.trialsCount) {
        setIsComplete(true);
      } else {
        setCurrentTrial(prev => prev + 1);
        setCurrentSet(generateTrial());
        setTrialStartTime(Date.now());
        setFeedback(null);
      }
    }, 800);
  };

  if (!currentSet) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-8">
        <div className="text-sm text-muted-foreground">
          Trial {currentTrial + 1} / {config.trialsCount}
        </div>
        <div className="text-sm font-mono text-primary">{timeLeft}s</div>
        <div className="text-sm text-muted-foreground">
          Score: {score}
        </div>
      </div>

      {/* Instruction */}
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Tap the item that doesn't belong
      </p>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentSet.items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={!!feedback}
            className={cn(
              "w-24 h-24 rounded-xl text-4xl flex items-center justify-center",
              "border-2 transition-all duration-200",
              "bg-card hover:bg-primary/10",
              feedback && index === currentSet.oddIndex && "bg-green-500/20 border-green-500",
              feedback === "wrong" && index !== currentSet.oddIndex && "opacity-50",
              !feedback && "border-border hover:border-primary"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={cn(
          "text-lg font-semibold",
          feedback === "correct" ? "text-green-400" : "text-red-400"
        )}>
          {feedback === "correct" ? "Correct!" : "Wrong!"}
        </div>
      )}

      {/* Progress */}
      <div className="w-full max-w-md mt-8">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentTrial / config.trialsCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
