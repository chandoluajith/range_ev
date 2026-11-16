"use client";

import React from "react";
import { HelpCircle, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { ExplainabilityFactor } from "@/types/telemetry";

interface ExplainabilityPanelProps {
  factors: ExplainabilityFactor[];
}

export function ExplainabilityPanel({ factors }: ExplainabilityPanelProps) {
  const drainKm = factors
    .filter((f) => f.direction === "drain")
    .reduce((acc, curr) => acc + Math.abs(curr.impactKm), 0);

  const recaptureKm = factors
    .filter((f) => f.direction === "recapture")
    .reduce((acc, curr) => acc + Math.abs(curr.impactKm), 0);

  return (
    <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
              Why Did Range Change?
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            SHAP DECOMPOSITION
          </span>
        </div>
        <p className="text-[12px] text-slate-400 mt-1 font-sans">
          Ranked kinematic, topographic, and thermal sensitivities relative to EPA baseline.
        </p>
      </div>

      {/* Feature Attribution Micro-bars */}
      <div className="my-4 flex flex-col gap-2.5">
        {factors.map((factor) => {
          const isRecapture = factor.direction === "recapture";
          const barColor = isRecapture
            ? "from-emerald-500/80 to-emerald-400"
            : "from-rose-500/80 to-rose-400";
          const textColor = isRecapture ? "text-emerald-400" : "text-rose-400";

          return (
            <div
              key={factor.id}
              className="flex flex-col gap-1 p-2 rounded-xl bg-white/[0.015] hover:bg-white/[0.035] transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-medium font-sans text-slate-200">
                  {isRecapture ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span>{factor.name}</span>
                </div>

                <span className={`font-mono font-semibold ${textColor}`}>
                  {factor.impactKm > 0 ? `+${factor.impactKm}` : factor.impactKm} km
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden flex border border-white/[0.03]">
                <div
                  className={`bg-gradient-to-r ${barColor} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${factor.relativeMagnitude}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 font-sans pl-5">
                {factor.detail}
              </span>
            </div>
          );
        })}
      </div>

      {/* Net Balance Summary Bar */}
      <div className="bg-black/30 border border-white/[0.04] rounded-xl p-3 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-rose-400 font-medium">-{drainKm} km drag</span>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-medium">+{recaptureKm} km recapture</span>
        </div>
        <div className="text-slate-300 font-medium">
          Net Drift: <span className="text-slate-400">160 →</span>{" "}
          <span className="text-white font-semibold">148 km</span>
        </div>
      </div>
    </div>
  );
}
