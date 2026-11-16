"use client";

import React, { useState } from "react";
import {
  Radio,
  Play,
  Pause,
  Gauge,
  Zap,
  BatteryCharging,
  Activity,
  Thermometer,
  Mountain,
  RotateCw,
  Terminal,
  Cpu,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Compass,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { LineChart } from "@/components/charts/LineChart";
import { useTelemetry, DrivingScenario } from "@/hooks/useTelemetry";

export default function LiveTelemetryPage() {
  const {
    metrics,
    activeTimeSeries,
    scenario,
    setScenario,
    isPlaying,
    togglePlay,
    canFrames,
    updateCount,
  } = useTelemetry();

  // Extract slices for live stream charts
  const speedData = activeTimeSeries.slice(-20).map((p) => p.speed);
  const powerData = activeTimeSeries.slice(-20).map((p) => p.motorPower);
  const voltData = activeTimeSeries.slice(-20).map((p) => p.voltage);
  const labels = activeTimeSeries.slice(-20).map((p) => p.timestamp);

  const scenarios: DrivingScenario[] = [
    "Alpine Ascent",
    "Highway Cruise",
    "Urban Stop & Go",
    "Downhill Regen",
  ];

  // Dynamic Live Prediction Engine outputs reacting to the selected scenario in real time
  const scenarioPredictions = {
    "Alpine Ascent": {
      physicsBaseKm: 148,
      mlDeltaKm: -10,
      mlReason: "Topographic Incline Work (+2.4% Grade)",
      personalizedRangeKm: 138,
      confidenceKm: 8,
      lowerCiKm: 130,
      upperCiKm: 146,
      whKm: 184,
      shapFactors: [
        { name: "Topographic Climb (+2.4% slope)", delta: "-8.4 km", dir: "drain", color: "#f59e0b" },
        { name: "Motor Thermal Load", delta: "-2.6 km", dir: "drain", color: "#ef4444" },
        { name: "Regenerative Braking Buffer", delta: "+1.0 km", dir: "recapture", color: "#10b981" },
      ],
      presentationNote: "Steep +2.4% incline burns 184 Wh/km. First-principles physics baseline is 148 km, and the ML residual model deducts -10 km for sustained gravitational climb work.",
    },
    "Highway Cruise": {
      physicsBaseKm: 156,
      mlDeltaKm: -12,
      mlReason: "High-Speed Aerodynamic Drag (118 km/h v³ Curve)",
      personalizedRangeKm: 144,
      confidenceKm: 8,
      lowerCiKm: 136,
      upperCiKm: 152,
      whKm: 172,
      shapFactors: [
        { name: "Aerodynamic Drag (118 km/h v³)", delta: "-9.8 km", dir: "drain", color: "#38bdf8" },
        { name: "Rolling Resistance (Michelin EV)", delta: "-2.8 km", dir: "drain", color: "#94a3b8" },
        { name: "Steady Cruise Kinematics", delta: "+0.6 km", dir: "recapture", color: "#10b981" },
      ],
      presentationNote: "Aerodynamic drag dominates at 118 km/h (quadratic speed term v² and cubic power v³). The ML model deducts -12 km from the 156 km physics baseline, predicting 144 km ±8 km.",
    },
    "Urban Stop & Go": {
      physicsBaseKm: 150,
      mlDeltaKm: +2,
      mlReason: "Low Aerodynamic Drag & City Kinematics",
      personalizedRangeKm: 152,
      confidenceKm: 8,
      lowerCiKm: 144,
      upperCiKm: 160,
      whKm: 138,
      shapFactors: [
        { name: "Minimal Aerodynamic Drag (<40 km/h)", delta: "+4.2 km", dir: "recapture", color: "#10b981" },
        { name: "Stop-Start Inertia Penalties", delta: "-3.1 km", dir: "drain", color: "#f59e0b" },
        { name: "Auxiliary HVAC Idle Draw", delta: "-0.9 km", dir: "drain", color: "#818cf8" },
      ],
      presentationNote: "Low urban velocity minimizes aerodynamic drag. Despite frequent throttle transitions, the ML model predicts +2 km surplus over baseline (152 km estimated range).",
    },
    "Downhill Regen": {
      physicsBaseKm: 154,
      mlDeltaKm: +11,
      mlReason: "Active Deceleration Energy Recapture (-14.2 kW)",
      personalizedRangeKm: 165,
      confidenceKm: 8,
      lowerCiKm: 157,
      upperCiKm: 173,
      whKm: -24,
      shapFactors: [
        { name: "Regenerative Energy Influx (-14.2 kW)", delta: "+12.8 km", dir: "recapture", color: "#10b981" },
        { name: "Rotor Thermal Dissipation", delta: "-1.2 km", dir: "drain", color: "#f97316" },
        { name: "Inverter Rectification Loss", delta: "-0.6 km", dir: "drain", color: "#94a3b8" },
      ],
      presentationNote: "Motor power spikes negative (-14.2 kW) on -3.8% descent. The battery pack actively charges, boosting predicted range to 165 km (+11 km over physics baseline).",
    },
  };

  const currentPred = scenarioPredictions[scenario];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Scenario Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
              Live Telemetry &amp; Real-Time Prediction
            </h1>
            <Badge variant="warning" size="md" dot pulse>
              Simulation Mode: 100 Hz RT
            </Badge>
          </div>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Real-time CAN bus telemetry stream paired with the Physics-Informed ML Range Prediction Engine
          </p>
        </div>

        {/* Scenario Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-black/40 border border-white/[0.08] p-1 rounded-xl">
            {scenarios.map((sc) => (
              <button
                key={sc}
                onClick={() => setScenario(sc)}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  scenario === sc
                    ? "bg-sky-500/25 text-sky-300 font-semibold border border-sky-400/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {sc}
              </button>
            ))}
          </div>

          <Button
            variant={isPlaying ? "glass" : "primary"}
            size="sm"
            onClick={togglePlay}
            className="gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Feed</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE 1: LIVE 3-STEP RANGE INTELLIGENCE SYNTHESIS ENGINE (HERO STRIP) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl glass-panel p-5 border border-sky-500/25 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-sans tracking-tight">
                  Live Dynamic Range Prediction Pipeline
                </h2>
                <Badge variant="primary" size="sm">
                  Active Scenario: {scenario}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Deterministic 3-step synthesis from First-Principles Physics through ML Residuals to Personalized Range
              </p>
            </div>
          </div>

          {/* Hero Estimated Range Stat Callout */}
          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-sky-400/30">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-medium">Predicted Remaining Range</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-300 tracking-tight">
                  {currentPred.personalizedRangeKm} km
                </span>
                <span className="text-xs font-mono text-slate-400">
                  (95% CI: {currentPred.lowerCiKm} – {currentPred.upperCiKm} km)
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-700 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono uppercase text-slate-400">Net Consumption</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {metrics.currentWhKm} Wh/km
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Visual Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
          {/* Step 1: First-Principles Physics */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 font-semibold">
                STEP 01
              </span>
              <span className="font-mono font-bold text-slate-200 text-sm">
                {currentPred.physicsBaseKm} km
              </span>
            </div>
            <div className="text-xs font-semibold text-white">First-Principles Physics Base</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Kinematic rolling resistance ($C_{'{'}rr{'}'}$), $C_d \cdot A$ aero drag, GPS elevation incline.
            </div>
          </div>

          {/* Step 2: ML Residual Correction */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold">
                STEP 02 (VED ML)
              </span>
              <span className={`font-mono font-bold text-sm ${currentPred.mlDeltaKm >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                {currentPred.mlDeltaKm >= 0 ? "+" : ""}{currentPred.mlDeltaKm} km
              </span>
            </div>
            <div className="text-xs font-semibold text-white">LightGBM Residual Correction</div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate" title={currentPred.mlReason}>
              {currentPred.mlReason}
            </div>
          </div>

          {/* Step 3: Personalized Range Output */}
          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-200 font-semibold">
                STEP 03 (FINAL)
              </span>
              <span className="font-mono font-extrabold text-sm text-sky-300">
                {currentPred.personalizedRangeKm} km
              </span>
            </div>
            <div className="text-xs font-bold text-white">Personalized Dynamic Range</div>
            <div className="text-[11px] text-sky-300/80 mt-0.5">
              Confidence Interval: ±8 km · Convergence: 99.4%
            </div>
          </div>
        </div>

        {/* Live SHAP Factor Attribution & Live Demonstration Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3 border-t border-white/[0.06]">
          {/* SHAP Attribution Breakdown (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-medium">
              Live SHAP Attribution Factors for {scenario}:
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPred.shapFactors.map((f, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }}></span>
                  <span className="text-slate-300">{f.name}:</span>
                  <span className="font-bold" style={{ color: f.color }}>{f.delta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Presenter Talking Points Callout (5 cols) */}
          <div className="lg:col-span-5 p-2.5 rounded-xl bg-slate-900/90 border border-sky-500/20 flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
              <strong className="text-sky-300 font-semibold">Demonstration Script: </strong>
              {currentPred.presentationNote}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics Grid (10 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <Metric
          label="Ground Speed"
          value={metrics.speed}
          unit="km/h"
          icon={<Gauge className="w-4 h-4 text-sky-400" />}
          comparison="Target 60"
          status={metrics.speedState}
          statusType="optimal"
        />

        <Metric
          label="Traction Motor Power"
          value={metrics.batteryPower}
          unit="kW"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          comparison="Peak 260 kW"
          status={`${metrics.powerPercentPeak}% Peak Cap`}
          statusType={metrics.batteryPower < 0 ? "warning" : "optimal"}
        />

        <Metric
          label="High Voltage DC Bus"
          value={metrics.voltage}
          unit="V"
          icon={<BatteryCharging className="w-4 h-4 text-sky-400" />}
          comparison="Nominal 360 V"
          status="DC Bus Sync"
          statusType="optimal"
        />

        <Metric
          label="Traction Draw Current"
          value={metrics.current}
          unit="A"
          icon={<Activity className="w-4 h-4 text-sky-400" />}
          comparison={metrics.currentMode}
          status="CAN #0x250"
          statusType="neutral"
        />

        <Metric
          label="Battery Pack Thermal"
          value={metrics.batteryTemperature}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-emerald-400" />}
          comparison="25 - 35°C Window"
          status={metrics.tempZone}
          statusType="optimal"
        />

        <Metric
          label="Road Gradient"
          value={`${metrics.roadGradient >= 0 ? "+" : ""}${metrics.roadGradient}`}
          unit="%"
          icon={<Mountain className="w-4 h-4 text-amber-400" />}
          comparison="GPS/IMU Grade"
          status={metrics.gradeType}
          statusType="warning"
        />

        <Metric
          label="Regenerative Power"
          value={metrics.regenPowerKW}
          unit="kW"
          icon={<RotateCw className="w-4 h-4 text-emerald-400" />}
          comparison="Max 275 kW"
          status={metrics.regenPowerKW > 0 ? "Regen Active" : "Freewheeling"}
          statusType={metrics.regenPowerKW > 0 ? "optimal" : "neutral"}
        />

        <Metric
          label="State of Charge (SOC)"
          value={metrics.socPercent}
          unit="%"
          icon={<BatteryCharging className="w-4 h-4 text-sky-400" />}
          comparison={`${metrics.usableEnergyRemainingKWh} kWh`}
          status="Nominal Range"
          statusType="optimal"
        />

        <Metric
          label="Inverter Temperature"
          value={metrics.inverterTempC}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-sky-400" />}
          comparison="Liquid Cooled"
          status="38.4°C Nominal"
          statusType="optimal"
        />

        <Metric
          label="Dynamic Consumption"
          value={metrics.currentWhKm}
          unit="Wh/km"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          comparison="Kinematic Model"
          status="151 Baseline"
          statusType="optimal"
        />
      </div>

      {/* Dual Telemetry Oscilloscope Traces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl glass-panel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[14px] font-semibold text-white font-sans">
                Power &amp; Speed Telemetry Stream
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Continuous rolling 20-sample window
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-sky-400">● Speed (km/h)</span>
              <span className="text-emerald-400">● Power (kW)</span>
            </div>
          </div>

          <LineChart
            height={200}
            labels={labels}
            series={[
              { id: "speed", name: "Speed", color: "#38bdf8", data: speedData },
              { id: "power", name: "Power", color: "#10b981", data: powerData },
            ]}
          />
        </div>

        <div className="rounded-2xl glass-panel p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[14px] font-semibold text-white font-sans">
                High-Voltage Bus Potential Trace
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Battery Pack Voltage (V) vs Nominal 360V
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-sky-400">● Bus Voltage (V)</span>
            </div>
          </div>

          <LineChart
            height={200}
            labels={labels}
            minY={340}
            maxY={375}
            series={[
              { id: "voltage", name: "Voltage", color: "#38bdf8", data: voltData },
            ]}
          />
        </div>
      </div>

      {/* Simulated CAN Bus Frame Inspector */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-[15px] font-semibold text-white font-sans">
              Simulated CAN Bus Message Stream
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Frame updates: {updateCount} | 500 kbps Baud
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <th className="py-2.5 px-3">CAN ID</th>
                <th className="py-2.5 px-3">Source Node</th>
                <th className="py-2.5 px-3">Raw Byte Payload</th>
                <th className="py-2.5 px-3">Signal Name</th>
                <th className="py-2.5 px-3">Physical Value</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {canFrames.map((frame) => (
                <tr key={frame.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 text-sky-400 font-bold">{frame.canId}</td>
                  <td className="py-2.5 px-3 text-slate-300">{frame.sourceNode}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono tracking-wider">
                    {frame.dataHex}
                  </td>
                  <td className="py-2.5 px-3 text-white font-medium">{frame.signalName}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                    {frame.physicalValue} {frame.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">
                    {frame.frequencyHz} Hz
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
