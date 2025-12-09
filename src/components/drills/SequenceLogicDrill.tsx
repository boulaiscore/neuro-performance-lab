import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SequenceLogicDrillProps {
  config: {
    trialsCount: number;
    timePerTrial: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  timeLimit: number;
  onComplete: (result: { score: number; correct: number; avgReactionTime: number }) => void;
}

type SequencePuzzle = {
  sequence: (number | string)[];
  options: (number | string)[];
  correctIndex: number;
};

function generateNumberSequence(difficulty: string): SequencePuzzle {
  const patterns = {
    easy: [
      // Add 1, 2, 3
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 3) + 1;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        const answer = start + step * 4;
        const options = [answer, answer + 1, answer - 1, answer + step].sort(() => Math.random() - 0.5);
        return { sequence: seq, options, correctIndex: options.indexOf(answer) };
      },
    ],
    medium: [
      // Multiply by 2
      () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const seq = [start, start * 2, start * 4, start * 8];
        const answer = start * 16;
        const options = [answer, answer / 2, answer + 4, answer * 2].sort(() => Math.random() - 0.5);
        return { sequence: seq, options, correctIndex: options.indexOf(answer) };
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 2;
        const seq = [a, b, a + b, b + (a + b)];
        const answer = (a + b) + (b + (a + b));
        const options = [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5);
        return { sequence: seq, options, correctIndex: options.indexOf(answer) };
      },
    ],
    hard: [
      // Squares
      () => {
        const start = Math.floor(Math.random() * 3) + 1;
        const seq = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2), (start + 3) * (start + 3)];
        const answer = (start + 4) * (start + 4);
        const options = [answer, answer + 1, answer - 1, (start + 5) * (start + 5)].sort(() => Math.random() - 0.5);
        return { sequence: seq, options, correctIndex: options.indexOf(answer) };
      },
    ],
  };

  const difficultyPatterns = patterns[difficulty as keyof typeof patterns] || patterns.easy;
  const patternFn = difficultyPatterns[Math.floor(Math.random() * difficultyPatterns.length)];
  return patternFn();
}

export function SequenceLogicDrill({ config, timeLimit, onComplete }: SequenceLogicDrillProps) {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [trialStartTime, setTrialStartTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<SequencePuzzle | null>(null);

  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Initialize
  useEffect(() => {
    setCurrentPuzzle(generateNumberSequence(config.difficulty));
    setTrialStartTime(Date.now());
  }, [config.difficulty]);

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
    if (feedback || !currentPuzzle) return;

    const reactionTime = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);

    if (index === currentPuzzle.correctIndex) {
      setFeedback("correct");
      setCorrect(prev => prev + 1);
      setScore(prev => prev + Math.max(150 - Math.floor(reactionTime / 100), 20));
    } else {
      setFeedback("wrong");
    }

    setTimeout(() => {
      if (currentTrial + 1 >= config.trialsCount) {
        setIsComplete(true);
      } else {
        setCurrentTrial(prev => prev + 1);
        setCurrentPuzzle(generateNumberSequence(config.difficulty));
        setTrialStartTime(Date.now());
        setFeedback(null);
      }
    }, 1000);
  };

  if (!currentPuzzle) return null;

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
      <p className="text-lg text-center mb-6 text-muted-foreground">
        What comes next in the sequence?
      </p>

      {/* Sequence */}
      <div className="flex items-center gap-3 mb-8">
        {currentPuzzle.sequence.map((item, index) => (
          <div
            key={index}
            className="w-14 h-14 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-xl font-bold"
          >
            {item}
          </div>
        ))}
        <div className="w-14 h-14 rounded-lg border-2 border-dashed border-primary/60 flex items-center justify-center text-xl font-bold text-primary">
          ?
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {currentPuzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={!!feedback}
            className={cn(
              "h-14 rounded-xl text-xl font-bold",
              "border-2 transition-all duration-200",
              "bg-card hover:bg-primary/10",
              feedback && index === currentPuzzle.correctIndex && "bg-green-500/20 border-green-500",
              feedback === "wrong" && index !== currentPuzzle.correctIndex && "opacity-50",
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
