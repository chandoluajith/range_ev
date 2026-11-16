"use client";

import React from "react";
import { Zap, RotateCw, Wind, Mountain, BatteryCharging, Gauge } from "lucide-react";
import { Metric } from "@/components/ui/Metric";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function EnergyPage() {
  const { metrics, activeTimeSeries, timeWindow, setTimeWindow } = useTelemetry();

  // Consumption by Speed Items
  const consumptionBySpeed = [
    { label: "30 - 50 km/h (Urban Drag)", baseline: 128, hybrid: 122, unit: "Wh/km" },
    { label: "50 - 80 km/h (Secondary Roads)", baseline: 148, hybrid: 144, unit: "Wh/km" },
    { label: "80 - 100 km/h (Expressway)", baseline: 165, hybrid: 160, unit: "Wh/km" },
    { label: "100 - 130 km/h (Highway Aero)", baseline: 198, hybrid: 191, unit: "Wh/km" },
    { label: "130+ km/h (High-Speed Cruise)", baseline: 242, hybrid: 236, unit: "Wh/km" },
  ];

  // Consumption by Gradient Items
  const consumptionByGradient = [
    { label: "-4.0% to -2.0% (Descent Regen)", baseline: -18, hybrid: -24, unit: "Wh/km" },
    { label: "-2.0% to 0.0% (Gentle Slope)", baseline: 65, hybrid: 62, unit: "Wh/km" },
    { label: "0.0% to +2.0% (Rolling Grade)", baseline: 152, hybrid: 149, unit: "Wh/km" },
    { label: "+2.0% to +4.0% (Alpine Incline)", baseline: 215, hybrid: 208, unit: "Wh/km" },
    { label: "+4.0%+ (Steep Climb)", baseline: 288, hybrid: 279, unit: "Wh/km" },
  ];

  // Energy Distribution Breakdown
  const energyLossDistribution = [
    { id: "aero", label: "Aerodynamic Drag", percentage: 46, color: "#38bdf8", valueDescription: "CdA 0.512 m²" },
    { id: "rolling", label: "Rolling Resistance", percentage: 23, color: "#94a3b8", valueDescription: "Crr 0.0095" },
    { id: "gravity", label: "Topographic Work", percentage: 11, color: "#f59e0b", valueDescription: "+183m ascent" },
    { id: "aux", label: "Auxiliary HVAC", percentage: 12, color: "#818cf8", valueDescription: "1.2 kW draw" },
    { id: "regen", label: "Recaptured Regen", percentage: 8, color: "#10b981", valueDescription: "0.8 kWh return" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
          Energy &amp; Powertrain Analytics
        </h1>
        <p className="text-[13px] text-slate-400 font-sans mt-0.5">
          Detailed kinematic losses, aerodynamic drag curves, and regenerative energy recovery
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Metric
          label="Current Consumption"
          value={metrics.currentWhKm}
          unit="Wh/km"
          icon={<Zap className="w-4 h-4 text-sky-400" />}
          comparison="-4.2% vs baseline"
          status="Optimal Efficiency"
          statusType="optimal"
        />

        <Metric
          label="Traction Motor Power"
          value={metrics.batteryPower}
          unit="kW"
          icon={<BatteryCharging className="w-4 h-4 text-emerald-400" />}
          comparison="7.1% of 260 kW cap"
          status="DC Bus Sync"
          statusType="optimal"
        />

        <Metric
          label="Recaptured Regen"
          value={metrics.regenPowerKW > 0 ? metrics.regenPowerKW : "0.8"}
          unit="kWh Total"
          icon={<RotateCw className="w-4 h-4 text-emerald-400" />}
          comparison="11.9% Recovery Rate"
          status="KERS Active"
          statusType="optimal"
        />

        <Metric
          label="Auxiliary HVAC Draw"
          value={metrics.auxHvacPowerKW}
          unit="kW"
          icon={<Wind className="w-4 h-4 text-sky-400" />}
          comparison="Cabin 21.0°C Auto"
          status="Eco Mode"
          statusType="neutral"
        />
      </div>

      {/* Primary Multi-Line Energy Time-Series Chart */}
      <EnergyChart
        data={activeTimeSeries}
        timeWindow={timeWindow}
        onSelectTimeWindow={setTimeWindow}
      />

      {/* Consumption Distribution & Breakdown */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Powertrain Energy Loss Decomposition
            </h3>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              First-principles aerodynamic, tire hysteresis, and gravitational potential decomposition
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            Net Drivetrain Efficiency: 94.2%
          </span>
        </div>

        <DistributionChart segments={energyLossDistribution} />
      </div>

      {/* 2-Column: Consumption by Speed & Consumption by Gradient */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              <h3 className="text-[15px] font-semibold text-white font-sans">
                Energy Consumption by Speed
              </h3>
            </div>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              Aerodynamic drag escalates quadratically (CdA · v²); comparing physics model to ML hybrid
            </p>
          </div>

          <ComparisonChart
            items={consumptionBySpeed}
            baselineName="Physics Baseline"
            hybridName="PINN Hybrid"
          />
        </div>

        <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-amber-400" />
              <h3 className="text-[15px] font-semibold text-white font-sans">
                Energy Consumption by Road Gradient
              </h3>
            </div>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              Gravitational work (m · g · sin θ) with negative power during downhill regenerative braking
            </p>
          </div>

          <ComparisonChart
            items={consumptionByGradient}
            baselineName="Physics Baseline"
            hybridName="PINN Hybrid"
          />
        </div>
      </div>
    </div>
  );
}
