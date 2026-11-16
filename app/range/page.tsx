"use client";

import React from "react";
import { Compass, Sliders, TrendingUp, Cpu, Thermometer, Wind, User, Weight, RotateCcw } from "lucide-react";
import { RangeHero } from "@/components/dashboard/RangeHero";
import { RangeIntelligence } from "@/components/dashboard/RangeIntelligence";
import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/Button";
import { useRange } from "@/hooks/useRange";

export default function PredictiveRangePage() {
  const {
    prediction,
    factors,
    sensitivities,
    updateSensitivity,
    resetSensitivities,
  } = useRange();

  // Range convergence timeline data (simulating how prediction converges as trip progresses)
  const timelineLabels = ["0 km", "10 km", "20 km", "30 km", "42.8 km (Now)", "+25 km", "+50 km Horizon"];
  const physicsTimeline = [168, 162, 158, 156, 154, 151, 148];
  const mlTimeline = [160, 155, 152, 149, 148, 147, 146];
  const personalizedTimeline = [160, 156, 151, 149, 148, 148, 147];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
            Dynamic Range Intelligence
          </h1>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Physics-informed personalized range estimation with active confidence intervals
          </p>
        </div>

        <Button variant="glass" size="sm" onClick={resetSensitivities} className="gap-1.5 self-start">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sensitivity Sliders</span>
        </Button>
      </div>

      {/* Hero Panel & Prediction Pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-5">
          <RangeHero prediction={prediction} />
        </div>
        <div className="xl:col-span-7">
          <RangeIntelligence prediction={prediction} />
        </div>
      </div>

      {/* Interactive Sensitivity Workbench (Sliders for What-If Simulation) */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Range Sensitivity Scenario Simulator
            </h3>
          </div>
          <span className="text-[11px] font-mono text-sky-400">
            {prediction.netSensitivityDeltaKm >= 0 ? "+" : ""}
            {prediction.netSensitivityDeltaKm} km Net Scenario Impact
          </span>
        </div>

        <p className="text-[12px] text-slate-400 font-sans -mt-2">
          Adjust physical and behavioral conditions to evaluate real-time range degradation without modifying vehicle firmware.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
          {/* Slider 1: Ambient Temperature */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                Ambient Temp
              </span>
              <span className="text-white font-semibold">{sensitivities.ambientTempC}°C</span>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              step="1"
              value={sensitivities.ambientTempC}
              onChange={(e) => updateSensitivity("ambientTempC", parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/[0.1] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Optimal window: 18 - 24°C
            </span>
          </div>

          {/* Slider 2: HVAC Power */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                HVAC Draw
              </span>
              <span className="text-white font-semibold">{sensitivities.hvacPowerKW} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="4.0"
              step="0.2"
              value={sensitivities.hvacPowerKW}
              onChange={(e) => updateSensitivity("hvacPowerKW", parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-white/[0.1] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Base auxiliary draw 1.2 kW
            </span>
          </div>

          {/* Slider 3: Driver Aggression */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Driver Aggression
              </span>
              <span className="text-white font-semibold">{sensitivities.driverAggressionMultiplier}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={sensitivities.driverAggressionMultiplier}
              onChange={(e) => updateSensitivity("driverAggressionMultiplier", parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-white/[0.1] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Throttle punch &amp; overtake frequency
            </span>
          </div>

          {/* Slider 4: Payload Weight */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Weight className="w-3.5 h-3.5 text-slate-400" />
                Payload Weight
              </span>
              <span className="text-white font-semibold">{sensitivities.payloadWeightKg} kg</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={sensitivities.payloadWeightKg}
              onChange={(e) => updateSensitivity("payloadWeightKg", parseFloat(e.target.value))}
              className="w-full accent-slate-400 h-1 bg-white/[0.1] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 font-mono">
              Passengers &amp; cargo load
            </span>
          </div>
        </div>
      </div>

      {/* Historical Range Changes & Prediction Timeline */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Range Convergence &amp; Historical Trajectory
            </h3>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              Comparing EPA catalog nominal baseline, first-principles physics, and PINN personalized estimation across trip progress
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-slate-400">--- Physics Baseline</span>
            <span className="text-emerald-400">● ML Adjusted</span>
            <span className="text-sky-400">● Personalized Estimate</span>
          </div>
        </div>

        <LineChart
          height={220}
          labels={timelineLabels}
          minY={130}
          maxY={175}
          unit="km"
          series={[
            { id: "physics", name: "Physics", color: "#94a3b8", dashed: true, data: physicsTimeline },
            { id: "ml", name: "ML Adjusted", color: "#10b981", data: mlTimeline },
            { id: "personalized", name: "Personalized", color: "#38bdf8", data: personalizedTimeline },
          ]}
        />
      </div>

      {/* Explainability Breakdown */}
      <ExplainabilityPanel factors={factors} />
    </div>
  );
}
