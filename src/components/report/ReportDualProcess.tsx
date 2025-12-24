// src/components/report/ReportDualProcess.tsx
import React, { useMemo } from "react";

function classify(score: number) {
  if (score >= 85) return "Elite";
  if (score >= 70) return "High";
  if (score >= 50) return "Moderate";
  return "Low";
}

export function ReportDualProcess({ profile, metrics }: any) {
  const fastDelta = metrics.fast_thinking - metrics.baseline_fast_thinking;
  const slowDelta = metrics.slow_thinking - metrics.baseline_slow_thinking;
  const ratio = metrics.slow_thinking > 0 ? metrics.fast_thinking / metrics.slow_thinking : null;

  const goals = (profile.training_goals ?? []).join(", ");

  return (
    <section className="report-page">
      <h2 style={{ fontSize: 20, marginBottom: 10 }}>Dual-Process Architecture</h2>

      <div className="avoid-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>System 1</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(metrics.fast_thinking)}/100</div>
          <div style={{ fontSize: 13 }}>
            Baseline: {Math.round(metrics.baseline_fast_thinking)} · Delta: {fastDelta >= 0 ? "+" : ""}{Math.round(fastDelta)}
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Level: <strong>{classify(metrics.fast_thinking)}</strong>
          </div>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>System 2</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.round(metrics.slow_thinking)}/100</div>
          <div style={{ fontSize: 13 }}>
            Baseline: {Math.round(metrics.baseline_slow_thinking)} · Delta: {slowDelta >= 0 ? "+" : ""}{Math.round(slowDelta)}
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            Level: <strong>{classify(metrics.slow_thinking)}</strong>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 13, opacity: 0.85 }}>
        Integration balance (Fast:Slow): <strong>{ratio ? ratio.toFixed(2) : "N/A"}</strong>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
        Training goals: <strong>{goals || "not set"}</strong>
      </div>

      {/* Se hai già il componente grafico FastSlowBrainMap, qui lo inserisci */}
      {/* <FastSlowBrainMap fast={metrics.fast_thinking} slow={metrics.slow_thinking} /> */}
    </section>
  );
}
