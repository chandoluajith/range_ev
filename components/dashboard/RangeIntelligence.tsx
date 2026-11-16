"use client";

import React from "react";
import { GitCommit, ArrowDown, Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { RangePrediction } from "@/types/telemetry";

interface RangeIntelligenceProps {
  prediction: RangePrediction;
}

export function RangeIntelligence({ prediction }: RangeIntelligenceProps) {
  const mlDelta = prediction.personalizedRange - prediction.physicsRange;

  return (
    <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
              Dynamic Range Intelligence
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-mono font-medium">
            Convergence {prediction.convergenceRate}%
          </span>
        </div>
        <p className="text-[12px] text-slate-400 mt-1 font-sans">
          Multi-stage predictive synthesis across first-principles physics and gradient boosted residual layers.
        </p>
      </div>

      {/* Step Convergence Visual Chain */}
      <div className="my-5 flex flex-col gap-2.5">
        {/* Step 1: Physics Model Baseline */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono font-semibold text-slate-400 text-[11px]">
            01
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white font-sans">
                Physics Model Baseline
              </span>
              <span className="text-[13px] font-mono text-slate-300 font-semibold tabular-nums">
                {prediction.physicsRange} km
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Kinematic rolling resistance, CdA aerodynamic drag, GPS topographic grade
            </span>
          </div>
        </div>

        {/* Connector 1 */}
        <div className="flex items-center justify-center -my-1 text-slate-500">
          <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] font-mono text-slate-400 ml-2">
            ML Adjustment: {mlDelta >= 0 ? "+" : ""}{mlDelta} km (Driver &amp; Aux Correction)
          </span>
        </div>

        {/* Step 2: ML Residual Adjuster */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-[11px]">
            02
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white font-sans">
                ML Residual Adjustment
              </span>
              <span className="text-[13px] font-mono text-emerald-400 font-semibold tabular-nums">
                {mlDelta >= 0 ? "+" : ""}{mlDelta} km
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Trained on 4.2M telemetry frames; driver acceleration variance &amp; thermal soak
            </span>
          </div>
        </div>

        {/* Connector 2 */}
        <div className="flex items-center justify-center -my-1 text-slate-500">
          <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] font-mono text-sky-400/80 ml-2">
            Calibrated Zero-Drift Anchor (±{prediction.confidence} km)
          </span>
        </div>

        {/* Step 3: Personalized Estimate */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-sky-950/25 border border-sky-400/30 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
          <div className="w-7 h-7 rounded-lg bg-sky-400 text-slate-950 flex items-center justify-center font-mono font-bold text-[11px] shadow-[0_0_8px_rgba(56,189,248,0.4)]">
            03
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white font-sans">
                Personalized Estimate
              </span>
              <span className="text-[16px] font-mono text-sky-300 font-bold tabular-nums">
                {prediction.personalizedRange} km
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Real-time driver footprint weighted with confidence interval ±{prediction.confidence} km (95% CI)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between text-slate-400 text-[11px] font-mono border-t border-white/[0.05]">
        <span>Kernel latency: 18ms</span>
        <span className="text-slate-300 font-medium">
          Updated {prediction.updatedAt}
        </span>
      </div>
    </div>
  );
}
