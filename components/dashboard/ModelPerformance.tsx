"use client";

import React from "react";
import { Cpu, CheckCircle2, Info } from "lucide-react";
import { mockModelMetrics, mockScatterPoints } from "@/data/mockModel";

export function ModelPerformance() {
  const metrics = mockModelMetrics;

  return (
    <section className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
              Prediction Accuracy
            </h3>
          </div>
          <p className="text-[12px] text-slate-400 mt-0.5 font-sans">
            Physics-Informed Neural Network (PINN) + Residual Gradient Boosting validation slice
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span>Cross-Validated (k={metrics.crossValidationFolds})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* 4 Key Accuracy Cards */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
              MAE
            </span>
            <div className="my-2">
              <span className="text-[28px] font-semibold text-white tracking-tight tabular-nums">
                {metrics.maeWhKm}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Wh/km (±0.4)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
              RMSE
            </span>
            <div className="my-2">
              <span className="text-[28px] font-semibold text-white tracking-tight tabular-nums">
                {metrics.rmseWhKm}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Wh/km penalty
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
              MAPE
            </span>
            <div className="my-2">
              <span className="text-[28px] font-semibold text-sky-400 tracking-tight tabular-nums">
                {metrics.mapePercent}%
              </span>
            </div>
            <span className="text-[11px] text-sky-400 font-medium">
              Mean absolute %
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
              R²
            </span>
            <div className="my-2">
              <span className="text-[28px] font-semibold text-emerald-400 tracking-tight tabular-nums">
                {metrics.r2Score}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Physics hybrid fit
            </span>
          </div>
        </div>

        {/* Actual vs Predicted Scatter Chart */}
        <div className="md:col-span-4 bg-black/30 border border-white/[0.04] p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white font-medium font-sans">Residual Alignment</span>
            <span className="text-slate-400 font-mono">Actual vs Predicted</span>
          </div>

          <div className="relative w-full h-28 my-2 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 90">
              {/* Perfect 45-degree Line */}
              <line
                x1="20"
                y1="75"
                x2="145"
                y2="15"
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.35"
              />

              {/* Data points mapping Wh/km: 60 - 260 */}
              {mockScatterPoints.map((pt) => {
                const x = 20 + ((pt.actualWhKm - 70) / 190) * 125;
                const y = 75 - ((pt.predictedWhKm - 70) / 190) * 60;
                const isOptimal = Math.abs(pt.residual) <= 2;
                return (
                  <circle
                    key={pt.id}
                    cx={x}
                    cy={y}
                    r={isOptimal ? 2.5 : 2}
                    fill={isOptimal ? "#10b981" : "#38bdf8"}
                    opacity={isOptimal ? 0.95 : 0.8}
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>70 Wh/km</span>
            <span className="text-emerald-400">Zero-drift diagonal</span>
            <span>260 Wh/km</span>
          </div>
        </div>
      </div>
    </section>
  );
}
