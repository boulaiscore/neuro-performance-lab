import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CategorySwitchDrillProps {
  config: {
    trialsCount: number;
    timePerTrial: number;
  };
  timeLimit: number;
  onComplete: (result: { score: number; correct: number; avgReactionTime: number }) => void;
}

type CategoryRule = "color" | "shape" | "size";

type Item = {
  shape: "circle" | "square" | "triangle";
  color: "red" | "blue" | "green";
  size: "small" | "large";
};

const SHAPES = {
  circle: "●",
  square: "■",
  triangle: "▲",
};

const COLORS = {
  red: "text-red-500",
  blue: "text-blue-500",
  green: "text-green-500",
};

function generateItem(): Item {
  const shapes: Item["shape"][] = ["circle", "square", "triangle"];
  const colors: Item["color"][] = ["red", "blue", "green"];
  const sizes: Item["size"][] = ["small", "large"];
  
  return {
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
  };
}

function generateOptions(item: Item, rule: CategoryRule): { options: string[]; correctIndex: number } {
  let options: string[];
  let correctAnswer: string;
  
  switch (rule) {
    case "color":
      options = ["Red", "Blue", "Green"];
      correctAnswer = item.color.charAt(0).toUpperCase() + item.color.slice(1);
      break;
    case "shape":
      options = ["Circle", "Square", "Triangle"];
      correctAnswer = item.shape.charAt(0).toUpperCase() + item.shape.slice(1);
      break;
    case "size":
      options = ["Small", "Large"];
      correctAnswer = item.size.charAt(0).toUpperCase() + item.size.slice(1);
      break;
  }
  
  return { options, correctIndex: options.indexOf(correctAnswer) };
}

export function CategorySwitchDrill({ config, timeLimit, onComplete }: CategorySwitchDrillProps) {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [trialStartTime, setTrialStartTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [currentRule, setCurrentRule] = useState<CategoryRule>("color");
  const [options, setOptions] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);

  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const rules: CategoryRule[] = ["color", "shape", "size"];

  // Initialize
  useEffect(() => {
    const item = generateItem();
    const rule = rules[Math.floor(Math.random() * rules.length)];
    const { options: opts, correctIndex: idx } = generateOptions(item, rule);
    
    setCurrentItem(item);
    setCurrentRule(rule);
    setOptions(opts);
    setCorrectIndex(idx);
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
    if (feedback) return;

    const reactionTime = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);

    if (index === correctIndex) {
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
        // Switch rule with 50% probability
        const newRule = Math.random() > 0.5 
          ? rules[(rules.indexOf(currentRule) + 1) % rules.length]
          : currentRule;
        
        const item = generateItem();
        const { options: opts, correctIndex: idx } = generateOptions(item, newRule);
        
        setCurrentTrial(prev => prev + 1);
        setCurrentItem(item);
        setCurrentRule(newRule);
        setOptions(opts);
        setCorrectIndex(idx);
        setTrialStartTime(Date.now());
        setFeedback(null);
      }
    }, 800);
  };

  if (!currentItem) return null;

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

      {/* Rule Indicator */}
      <div className="mb-4 px-4 py-2 bg-primary/20 rounded-lg">
        <span className="text-sm text-primary font-medium">
          Identify the: <span className="uppercase font-bold">{currentRule}</span>
        </span>
      </div>

      {/* Item Display */}
      <div className="mb-8 w-32 h-32 rounded-xl bg-card border border-border flex items-center justify-center">
        <span className={cn(
          COLORS[currentItem.color],
          currentItem.size === "large" ? "text-7xl" : "text-4xl"
        )}>
          {SHAPES[currentItem.shape]}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={!!feedback}
            className={cn(
              "h-12 rounded-xl text-sm font-medium",
              "border-2 transition-all duration-200",
              "bg-card hover:bg-primary/10",
              feedback && index === correctIndex && "bg-green-500/20 border-green-500",
              feedback === "wrong" && index !== correctIndex && "opacity-50",
              !feedback && "border-border hover:border-primary"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={cn(
          "mt-6 text-lg font-semibold",
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
