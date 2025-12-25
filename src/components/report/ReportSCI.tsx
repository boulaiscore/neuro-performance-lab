import React from "react";
import { CheckCircle, FileText, Brain, Lightbulb, TrendingUp, Activity } from "lucide-react";

interface ReportSCIProps {
  metrics: {
    cognitive_performance_score?: number | null;
    cognitive_level?: number | null;
    experience_points?: number | null;
    cognitive_readiness_score?: number | null;
    total_sessions?: number;
    fast_thinking?: number;
    slow_thinking?: number;
    focus_stability?: number;
    reasoning_accuracy?: number;
    baseline_fast_thinking?: number | null;
    baseline_slow_thinking?: number | null;
  };
}

export function ReportSCI({ metrics }: ReportSCIProps) {
  const sci = metrics.cognitive_performance_score ?? 50;
  const level = metrics.cognitive_level ?? 1;
  const readiness = metrics.cognitive_readiness_score ?? 50;
  const sessions = metrics.total_sessions ?? 0;

  const getPerformanceLabel = (score: number) => {
    if (score >= 85) return { label: "ELITE COGNITIVE PERFORMANCE", color: "#00897b" };
    if (score >= 70) return { label: "HIGH COGNITIVE PERFORMANCE", color: "#26a69a" };
    if (score >= 50) return { label: "DEVELOPING COGNITIVE PROFILE", color: "#ffb74d" };
    return { label: "FOUNDATION PHASE", color: "#e57373" };
  };

  const perfData = getPerformanceLabel(sci);

  const indicators = [
    { 
      name: "System 1 (Fast Thinking)", 
      description: "Intuitive, automatic processing speed",
      range: "0-100", 
      score: Math.round(metrics.fast_thinking ?? 50),
      baseline: metrics.baseline_fast_thinking,
      reference: "Kahneman (2011)"
    },
    { 
      name: "System 2 (Slow Thinking)", 
      description: "Deliberate, analytical processing",
      range: "0-100", 
      score: Math.round(metrics.slow_thinking ?? 50),
      baseline: metrics.baseline_slow_thinking,
      reference: "Kahneman (2011)"
    },
    { 
      name: "Attentional Control", 
      description: "Sustained focus and distractor inhibition",
      range: "0-100", 
      score: Math.round(metrics.focus_stability ?? 50),
      reference: "Posner & Petersen (1990)"
    },
    { 
      name: "Logical Reasoning", 
      description: "Deductive and inductive reasoning accuracy",
      range: "0-100", 
      score: Math.round(metrics.reasoning_accuracy ?? 50),
      reference: "Evans (2008)"
    },
  ];

  const sciRadius = 54;
  const sciCircumference = 2 * Math.PI * sciRadius;
  const sciOffset = sciCircumference - (sci / 100) * sciCircumference;

  return (
    <section className="report-page">
      <h2 className="report-section-title">Executive Summary</h2>
      <p className="report-subtitle">Synthesized Cognitive Index (SCI) derived from multi-domain assessment</p>

      <div className="summary-header" style={{ background: `linear-gradient(135deg, ${perfData.color} 0%, ${perfData.color}dd 100%)` }}>
        <div className="summary-check">
          <CheckCircle size={28} />
        </div>
        <div>
          <h2 className="summary-title">{perfData.label}</h2>
          <p className="summary-subtitle">Assessment completed · {sessions} training data points analyzed</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-icon">
            <FileText size={24} color="#00897b" />
          </div>
          <div className="summary-card-content">
            <h3>SYNTHESIZED COGNITIVE INDEX</h3>
            <div className="summary-card-score">
              {Math.round(sci)}<span>/100</span>
            </div>
            <p className="summary-card-desc">Composite score | Optimal range: 70-100</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-icon">
            <Activity size={24} color="#00897b" />
          </div>
          <div className="summary-card-content">
            <h3>COGNITIVE READINESS INDEX</h3>
            <div className="summary-card-score">
              {Math.round(readiness)}<span>/100</span>
            </div>
            <p className="summary-card-desc">Daily performance potential</p>
          </div>
        </div>
      </div>

      <h3 className="report-subsection-title">Cognitive Indicators Assessment</h3>
      <p className="table-intro">Performance metrics derived from evidence-based cognitive exercises:</p>
      
      <table className="indicators-table">
        <thead>
          <tr>
            <th>Cognitive Domain</th>
            <th>Score</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          {indicators.map((ind) => {
            const classification = ind.score >= 70 ? "Above Average" : ind.score >= 50 ? "Average" : "Below Average";
            const delta = ind.baseline ? ind.score - ind.baseline : null;
            return (
              <tr key={ind.name}>
                <td>
                  <div className="indicator-name">{ind.name}</div>
                  <div className="indicator-desc">{ind.description}</div>
                </td>
                <td>
                  <div className="indicator-bar">
                    <div 
                      className="indicator-bar-fill" 
                      style={{ width: `${Math.min(ind.score, 100)}%` }}
                    />
                  </div>
                  <div className="indicator-score-row">
                    <span className="indicator-score">{ind.score}</span>
                    {delta !== null && (
                      <span className={`indicator-delta ${delta >= 0 ? 'positive' : 'negative'}`}>
                        {delta >= 0 ? '+' : ''}{Math.round(delta)}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`classification-badge ${classification.toLowerCase().replace(' ', '-')}`}>
                    {classification}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="conclusions-box">
        <div className="conclusions-icon">
          <Lightbulb size={24} />
        </div>
        <div className="conclusions-content">
          <h3>CLINICAL INTERPRETATION</h3>
          <ul>
            <li>
              {sci >= 70 
                ? "Your cognitive profile demonstrates above-average performance across measured domains. Evidence suggests maintaining consistent training frequency optimizes neuroplastic gains (Lövdén et al., 2010)."
                : "Your cognitive profile indicates potential for enhancement through targeted training. Research supports that deliberate practice significantly improves cognitive function (Jaeggi et al., 2008)."}
            </li>
            <li>The NeuroLoop protocol utilizes adaptive difficulty algorithms to maintain optimal challenge levels for cognitive development.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
