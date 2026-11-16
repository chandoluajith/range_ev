"use client";

import React from "react";
import { Gauge, Zap, BatteryCharging, Activity, Thermometer, Mountain } from "lucide-react";

interface VehicleMetricsProps {
  speed: number;
  batteryPower: number;
  voltage: number;
  current: number;
  batteryTemperature: number;
  roadGradient: number;
}

export function VehicleMetrics({
  speed = 57,
  batteryPower = 18.4,
  voltage = 358.2,
  current = 51.4,
  batteryTemperature = 31.0,
  roadGradient = 2.4,
}: VehicleMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 w-full h-full">
      {/* Metric 1: Ground Speed */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            GROUND SPEED
          </span>
          <div className="w-6 h-6 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-white tracking-tight font-mono tabular-nums leading-none">
            {speed}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">km/h</span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04]">
          <span className="text-slate-400">Target 60</span>
          <span className="text-emerald-400 font-medium">Optimal Drag</span>
        </div>
      </div>

      {/* Metric 2: Traction Power */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            TRACTION POWER
          </span>
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-white tracking-tight font-mono tabular-nums leading-none">
            {batteryPower}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">kW</span>
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04] leading-tight">
          <div className="flex flex-col text-slate-400">
            <span>Peak 260</span>
            <span>kW</span>
          </div>
          <div className="flex flex-col text-right text-sky-400 font-medium">
            <span>7.1% Peak</span>
            <span>Cap</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Bus Potential */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            BUS POTENTIAL
          </span>
          <div className="w-6 h-6 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
            <BatteryCharging className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-white tracking-tight font-mono tabular-nums leading-none">
            {voltage}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">V</span>
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04] leading-tight">
          <div className="flex flex-col text-slate-400">
            <span>Nominal</span>
            <span>360 V</span>
          </div>
          <div className="flex flex-col text-right text-emerald-400 font-medium">
            <span>Δ -1.8 V</span>
            <span>(Stiff)</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Traction Draw */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            TRACTION DRAW
          </span>
          <div className="w-6 h-6 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-white tracking-tight font-mono tabular-nums leading-none">
            {current}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">A</span>
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04] leading-tight">
          <div className="flex flex-col text-slate-400">
            <span>Discharge</span>
            <span>Mode</span>
          </div>
          <div className="flex flex-col text-right text-slate-300">
            <span>DC Bus</span>
            <span>Sync</span>
          </div>
        </div>
      </div>

      {/* Metric 5: Pack Thermal */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            PACK THERMAL
          </span>
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <Thermometer className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-white tracking-tight font-mono tabular-nums leading-none">
            {batteryTemperature.toFixed(1)}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">°C</span>
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04] leading-tight">
          <div className="flex flex-col text-slate-400">
            <span>Window 25-</span>
            <span>35°C</span>
          </div>
          <div className="flex flex-col text-right text-emerald-400 font-medium">
            <span>Optimal</span>
            <span>Zone</span>
          </div>
        </div>
      </div>

      {/* Metric 6: Grade Incline */}
      <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[10px] uppercase font-mono tracking-wider font-medium">
            GRADE INCLINE
          </span>
          <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Mountain className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="my-1.5 flex items-baseline">
          <span className="text-[30px] sm:text-[34px] font-semibold text-amber-300 tracking-tight font-mono tabular-nums leading-none">
            {roadGradient >= 0 ? "+" : ""}{roadGradient.toFixed(1)}
          </span>
          <span className="text-[12px] text-slate-400 font-mono ml-1.5">%</span>
        </div>

        <div className="flex items-start justify-between text-[10px] font-mono pt-2 border-t border-white/[0.04] leading-tight">
          <div className="flex flex-col text-slate-400">
            <span>Kinetic Aero</span>
            <span>Drag</span>
          </div>
          <div className="flex flex-col text-right text-amber-400 font-medium">
            <span>Alpine</span>
            <span>Ascent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
