"use client";

import React from "react";
import { Navigation, Mountain, Zap, Clock } from "lucide-react";
import { currentTripSummaryData } from "@/data/mockTelemetry";

interface TripSummaryProps {
  data?: typeof currentTripSummaryData;
}

export function TripSummary({ data = currentTripSummaryData }: TripSummaryProps) {
  return (
    <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Navigation className="w-5 h-5 text-sky-400" />
            <h3 className="text-[16px] font-semibold text-white tracking-tight font-sans">
              Current Trip
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {data.tripActiveDuration} active
          </span>
        </div>
        <p className="text-[12px] text-slate-400 mt-1 font-sans">
          {data.routeTitle}
        </p>
      </div>

      {/* 6 Metrics Compact Grid */}
      <div className="my-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Distance
          </span>
          <span className="text-[18px] text-white font-semibold mt-0.5 tabular-nums">
            {data.distanceKm} <span className="text-[11px] text-slate-400 font-normal">km</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Energy Used
          </span>
          <span className="text-[18px] text-white font-semibold mt-0.5 tabular-nums">
            {data.energyUsedKWh} <span className="text-[11px] text-slate-400 font-normal">kWh</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Avg Consumption
          </span>
          <span className="text-[18px] text-sky-400 font-semibold mt-0.5 tabular-nums">
            {data.avgConsumptionWhKm} <span className="text-[11px] text-slate-400 font-normal">Wh/km</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Average Speed
          </span>
          <span className="text-[18px] text-white font-semibold mt-0.5 tabular-nums">
            {data.avgSpeedKmh} <span className="text-[11px] text-slate-400 font-normal">km/h</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Elevation Gain
          </span>
          <span className="text-[18px] text-amber-300 font-semibold mt-0.5 tabular-nums">
            +{data.elevationGainM} <span className="text-[11px] text-slate-400 font-normal">m</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-sans tracking-wide">
            Regenerated Energy
          </span>
          <span className="text-[18px] text-emerald-400 font-semibold mt-0.5 tabular-nums">
            {data.regenEnergyKWh} <span className="text-[11px] text-slate-400 font-normal">kWh</span>
          </span>
        </div>
      </div>

      {/* Mini Elevation Climb Profile */}
      <div className="bg-black/40 border border-white/[0.04] p-3 rounded-xl flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono uppercase">
            Climb Profile
          </span>
          <span className="text-[12px] font-mono text-white font-medium">
            {data.startElevationM}m → {data.currentElevationM}m
          </span>
        </div>

        {/* Subtle elevation step bars */}
        <div className="flex-1 h-7 flex items-end gap-1 px-2">
          {data.climbBars.map((height, i) => (
            <div
              key={i}
              className={`w-full rounded-t-sm transition-all duration-300 ${
                i >= 8
                  ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "bg-white/[0.08]"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <span className="text-[11px] text-emerald-400 font-mono font-medium">
          {data.regenRatePercent}% Regen Rate
        </span>
      </div>
    </div>
  );
}
