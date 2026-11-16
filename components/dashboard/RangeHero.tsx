"use client";

import React from "react";
import { TrendingUp, ShieldCheck, Zap, Compass } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RangePrediction } from "@/types/telemetry";

interface RangeHeroProps {
  prediction: RangePrediction;
  socPercent?: number;
  currentWhKm?: number;
  availableKWh?: number;
}

export function RangeHero({
  prediction,
  socPercent = 64.2,
  currentWhKm = 151,
  availableKWh = 59.8,
}: RangeHeroProps) {
  // SVG circular arc calculation: radius = 50, circumference = 2 * PI * 50 = 314.159
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Arc displays ~75% sweep, dashoffset calculated based on SOC (0 - 100)
  const socOffset = circumference - (socPercent / 100) * (circumference * 0.75);

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-6 flex flex-col justify-between group h-full">
      {/* Ambient Sapphire & Emerald Specular Highlights */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/15 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400 font-medium">
            KINEMATIC-ML STATE
          </span>
        </div>

        <Badge variant="success" size="sm" className="gap-1 font-mono">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>+{prediction.deltaVsNominal} km vs previous estimate</span>
        </Badge>
      </div>

      {/* Center Scalar & Semi-Circular Radial SVG SOC Gauge */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-4">
        <div className="sm:col-span-7 flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-medium">
            Estimated Remaining Range
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-[56px] sm:text-[64px] leading-none text-white tracking-tighter font-semibold font-sans drop-shadow-sm tabular-nums">
              {prediction.personalizedRange}
            </span>
            <span className="text-[18px] text-slate-400 font-mono font-normal">km</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[12px] mt-2 font-sans">
            <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 border border-sky-400/25 px-2 py-0.5 rounded font-medium">
              {prediction.confidencePercent}% CI
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              Range Confidence: ±{prediction.confidence} km
            </span>
          </div>
        </div>

        {/* Semi-Circular Radial SVG SOC Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Ring Track */}
              <circle
                className="text-white/[0.05]"
                cx="60"
                cy="60"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
                strokeWidth="6.5"
              />

              {/* Reserved Low-SOC Buffer Mark */}
              <circle
                className="text-amber-500/25"
                cx="60"
                cy="60"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * 0.88}
                strokeLinecap="round"
                strokeWidth="6.5"
              />

              {/* Active SOC Arc with Luminescence */}
              <circle
                className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000 ease-out"
                cx="60"
                cy="60"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={socOffset}
                strokeLinecap="round"
                strokeWidth="6.5"
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[26px] font-semibold text-white tracking-tight leading-none font-mono tabular-nums">
                {Math.round(socPercent)}
                <span className="text-[16px] text-sky-400">%</span>
              </span>
              <span className="text-[9px] text-slate-400 tracking-widest uppercase font-mono mt-1">
                BATTERY SOC
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 font-mono tracking-wider">
            Net {availableKWh} kWh Avail
          </span>
        </div>
      </div>

      {/* Bottom Readout Tray */}
      <div className="relative z-10 bg-black/30 border border-white/[0.04] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
            Current Consumption
          </span>
          <span className="text-[13px] text-white font-semibold font-mono tabular-nums">
            {currentWhKm} Wh/km
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.06] hidden sm:block" />

        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
            Target Horizon
          </span>
          <span className="text-[12px] text-slate-200 font-medium font-mono">
            {prediction.targetHorizon}
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.06] hidden sm:block" />

        <div className="flex flex-col text-right">
          <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
            Aux HVAC Draw
          </span>
          <span className="text-[12px] text-sky-400 font-medium font-mono">
            1.2 kW (Auto 21°C)
          </span>
        </div>
      </div>
    </div>
  );
}
