"use client";

import React from "react";
import { Activity, TrendingUp, Gauge } from "lucide-react";
import { DrivingBehaviorMetrics } from "@/types/telemetry";

interface DrivingBehaviorCardProps {
  data: DrivingBehaviorMetrics;
}

export function DrivingBehaviorCard({ data }: DrivingBehaviorCardProps) {
  // Sparkline coordinates for recent efficiency trend
  const sparkWidth = 140;
  const sparkHeight = 32;
  const values = data.recentEfficiencySeries.map((s) => s.value);
  const minVal = Math.min(...values) - 5;
  const maxVal = Math.max(...values) + 5;

  const points = data.recentEfficiencySeries
    .map((s, idx) => {
      const x = (idx / (values.length - 1)) * sparkWidth;
      const y = sparkHeight - ((s.value - minVal) / (maxVal - minVal)) * sparkHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
            Driving Style
          </h3>
          <p className="text-[12px] text-slate-400 mt-0.5 font-sans">
            {data.subtitle}
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono font-semibold text-[11px] uppercase tracking-wider">
          {data.classification}
        </div>
      </div>

      {/* 3 Behavioral Gauges */}
      <div className="my-4 flex flex-col gap-3.5">
        {/* Dimension 1: Acceleration */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300">
              Acceleration: <span className="text-white font-medium">{data.accelerationLabel}</span>
            </span>
            <span className="text-slate-400">{data.accelerationAggression} / 100</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
              style={{ width: `${data.accelerationAggression}%` }}
            />
          </div>
        </div>

        {/* Dimension 2: Braking */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300">
              Braking: <span className="text-emerald-400 font-medium">{data.brakingLabel}</span>
            </span>
            <span className="text-emerald-400 font-medium">{data.brakingConsistency} / 100</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${data.brakingConsistency}%` }}
            />
          </div>
        </div>

        {/* Dimension 3: Speed Variation */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300">
              Speed Variation: <span className="text-white font-medium">{data.speedVariationLabel}</span>
            </span>
            <span className="text-slate-400">{data.speedVariation} / 100</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
              style={{ width: `${data.speedVariation}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trend Bar with Line Sparkline */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04] text-[11px] font-mono">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recent efficiency trend: +{data.efficiencyTrendPercent}%</span>
          </div>
          <span className="text-slate-400 text-[10px] mt-0.5">
            15-min kinetic stabilization · {data.clusterId}
          </span>
        </div>

        {/* Micro Line Visualization */}
        <div className="w-28 h-7 flex items-center justify-end">
          <svg className="w-full h-full" viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}>
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
