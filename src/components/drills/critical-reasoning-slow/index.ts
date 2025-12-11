// Critical Reasoning Slow Thinking Drills - Socratic/Philosophical
// Area: critical_reasoning | Thinking Mode: slow

import { HiddenAssumptionDetector } from "./HiddenAssumptionDetector";
import { CounterexampleProbe } from "./CounterexampleProbe";
import { SocraticReversalTest } from "./SocraticReversalTest";
import { NecessaryConditionFinder } from "./NecessaryConditionFinder";
import { WeakLinkIdentification } from "./WeakLinkIdentification";
import { FactInferenceClassification } from "./FactInferenceClassification";
import { BestExplanationTest } from "./BestExplanationTest";
import { PrincipleViolationDetector } from "./PrincipleViolationDetector";
import { ConceptualCoherenceTest } from "./ConceptualCoherenceTest";
import { SocraticDifferentiationTest } from "./SocraticDifferentiationTest";

export {
  HiddenAssumptionDetector,
  CounterexampleProbe,
  SocraticReversalTest,
  NecessaryConditionFinder,
  WeakLinkIdentification,
  FactInferenceClassification,
  BestExplanationTest,
  PrincipleViolationDetector,
  ConceptualCoherenceTest,
  SocraticDifferentiationTest,
};

export interface CriticalReasoningSlowDrill {
  id: string;
  name: string;
  area: "critical_reasoning";
  thinkingMode: "slow";
  component: React.ComponentType<{ onComplete: (result: DrillResult) => void }>;
}

export interface DrillResult {
  score: number;
  correct: number;
  metadata?: Record<string, unknown>;
}

export const CRITICAL_REASONING_SLOW_DRILLS: CriticalReasoningSlowDrill[] = [
  {
    id: "cr_slow_hidden_assumption",
    name: "Hidden Assumption Detector",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: HiddenAssumptionDetector,
  },
  {
    id: "cr_slow_counterexample",
    name: "Counterexample Probe",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: CounterexampleProbe,
  },
  {
    id: "cr_slow_socratic_reversal",
    name: "Socratic Reversal Test",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: SocraticReversalTest,
  },
  {
    id: "cr_slow_necessary_condition",
    name: "Necessary Condition Finder",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: NecessaryConditionFinder,
  },
  {
    id: "cr_slow_weak_link",
    name: "Weak Link Identification",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: WeakLinkIdentification,
  },
  {
    id: "cr_slow_fact_inference",
    name: "Fact / Inference / Value",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: FactInferenceClassification,
  },
  {
    id: "cr_slow_best_explanation",
    name: "Best Explanation Test",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: BestExplanationTest,
  },
  {
    id: "cr_slow_principle_violation",
    name: "Principle Violation Detector",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: PrincipleViolationDetector,
  },
  {
    id: "cr_slow_conceptual_coherence",
    name: "Conceptual Coherence Test",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: ConceptualCoherenceTest,
  },
  {
    id: "cr_slow_socratic_differentiation",
    name: "Socratic Differentiation Test",
    area: "critical_reasoning",
    thinkingMode: "slow",
    component: SocraticDifferentiationTest,
  },
];

// Helper to get a random drill
export function getRandomCriticalReasoningSlowDrill(): CriticalReasoningSlowDrill {
  const index = Math.floor(Math.random() * CRITICAL_REASONING_SLOW_DRILLS.length);
  return CRITICAL_REASONING_SLOW_DRILLS[index];
}

// Helper to get drill by ID
export function getCriticalReasoningSlowDrillById(id: string): CriticalReasoningSlowDrill | undefined {
  return CRITICAL_REASONING_SLOW_DRILLS.find(drill => drill.id === id);
}
