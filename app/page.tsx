"use client";

import React from "react";
import { RangeHero } from "@/components/dashboard/RangeHero";
import { VehicleMetrics } from "@/components/dashboard/VehicleMetrics";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { RangeIntelligence } from "@/components/dashboard/RangeIntelligence";
import { DrivingBehaviorCard } from "@/components/dashboard/DrivingBehaviorCard";
import { ExplainabilityPanel } from "@/components/dashboard/ExplainabilityPanel";
import { TripSummary } from "@/components/dashboard/TripSummary";
import { ModelPerformance } from "@/components/dashboard/ModelPerformance";
import { useRange } from "@/hooks/useRange";
import { useTelemetry } from "@/hooks/useTelemetry";
import { drivingBehaviorData } from "@/data/mockTelemetry";

export default function OverviewPage() {
  const { prediction, factors } = useRange();
  const { metrics, activeTimeSeries, timeWindow, setTimeWindow } = useTelemetry();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
            Overview
          </h1>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Personalized EV intelligence · Real-time physics-informed powertrain synthesis
          </p>
        </div>
      </div>

      {/* Hero Range & Live Metrics Section */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-5">
          <RangeHero
            prediction={prediction}
            socPercent={metrics.socPercent}
            currentWhKm={metrics.currentWhKm}
            availableKWh={metrics.usableEnergyRemainingKWh}
          />
        </div>
        <div className="xl:col-span-7">
          <VehicleMetrics
            speed={metrics.speed}
            batteryPower={metrics.batteryPower}
            voltage={metrics.voltage}
            current={metrics.current}
            batteryTemperature={metrics.batteryTemperature}
            roadGradient={metrics.roadGradient}
          />
        </div>
      </section>

      {/* Energy Consumption Multi-Line Analytics Chart */}
      <EnergyChart
        data={activeTimeSeries}
        timeWindow={timeWindow}
        onSelectTimeWindow={setTimeWindow}
      />

      {/* Dynamic Range Intelligence & Explainability (2 Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6">
          <RangeIntelligence prediction={prediction} />
        </div>
        <div className="lg:col-span-6">
          <ExplainabilityPanel factors={factors} />
        </div>
      </section>

      {/* Driving Behavior & Current Trip (2 Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6">
          <DrivingBehaviorCard data={drivingBehaviorData} />
        </div>
        <div className="lg:col-span-6">
          <TripSummary />
        </div>
      </section>

      {/* Engineering Model Performance & Loss Accuracy */}
      <ModelPerformance />
    </div>
  );
}
