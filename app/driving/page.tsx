"use client";

import React from "react";
import { Activity, Gauge, TrendingUp, AlertTriangle, RotateCw, Compass } from "lucide-react";
import { Metric } from "@/components/ui/Metric";
import { DrivingBehaviorCard } from "@/components/dashboard/DrivingBehaviorCard";
import { LineChart } from "@/components/charts/LineChart";
import { drivingBehaviorData } from "@/data/mockTelemetry";

export default function DrivingBehaviorPage() {
  const data = drivingBehaviorData;

  // IMU acceleration distribution series
  const imuLabels = ["-3.0 m/s²", "-2.0", "-1.0", "0 (Coast)", "+1.0", "+2.0", "+3.0 m/s²"];
  const imuDistribution = [4, 12, 38, 72, 44, 18, 6];

  // Efficiency trend across recent sessions
  const sessionLabels = ["Session #837", "#838", "#839", "#840", "#841", "#842 (Active)"];
  const efficiencyHistory = [235, 142, 189, 138, 164, 151];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
          Kinematic &amp; Driving Behavior
        </h1>
        <p className="text-[13px] text-slate-400 font-sans mt-0.5">
          3-axis IMU kinematic clustering, throttle ramp profiles, and regenerative deceleration consistency
        </p>
      </div>

      {/* Top Behavioral Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Metric
          label="Driving Style"
          value={data.classification}
          icon={<Activity className="w-4 h-4 text-sky-400" />}
          comparison="Cluster #3B"
          status="Highway Optimized"
          statusType="optimal"
        />

        <Metric
          label="Hard Acceleration Events"
          value={data.hardAccelerationEvents}
          unit="Events"
          icon={<Gauge className="w-4 h-4 text-amber-400" />}
          comparison="> 2.5 m/s² threshold"
          status="Minimal Jerk"
          statusType="optimal"
        />

        <Metric
          label="Hard Braking Events"
          value={data.hardBrakingEvents}
          unit="Events"
          icon={<AlertTriangle className="w-4 h-4 text-emerald-400" />}
          comparison="> 3.0 m/s² threshold"
          status="Zero Breaches"
          statusType="optimal"
        />

        <Metric
          label="Regen Braking Capture"
          value={`${data.regenRecaptureRate}%`}
          icon={<RotateCw className="w-4 h-4 text-emerald-400" />}
          comparison="Decel energy recovered"
          status="High Efficiency"
          statusType="optimal"
        />
      </div>

      {/* Main Driving Behavior Card & Speed Variability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6">
          <DrivingBehaviorCard data={data} />
        </div>

        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-white font-sans">
                Kinematic IMU Acceleration Distribution
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Longitudinal G-Force (m/s²)
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1 font-sans">
              Histogram of vehicle longitudinal acceleration sampled at 100 Hz from Bosch 6-DOF IMU
            </p>
          </div>

          <div className="my-4">
            <LineChart
              height={180}
              labels={imuLabels}
              minY={0}
              maxY={80}
              unit="%"
              series={[
                { id: "imu", name: "Distribution", color: "#38bdf8", data: imuDistribution },
              ]}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/[0.04] pt-2">
            <span>Stop &amp; Start Frequency: {data.stopStartFrequency} stops/10km</span>
            <span className="text-emerald-400">Cornering stability: {data.corneringStabilityScore}/100</span>
          </div>
        </div>
      </div>

      {/* Historical Behavioral Trend Across Sessions */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Driver Consumption Consistency Across Sessions
            </h3>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              Historical energy consumption trend (Wh/km) per trip logged in vehicle memory
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Efficiency improving +3.2% rolling average
          </span>
        </div>

        <LineChart
          height={200}
          labels={sessionLabels}
          minY={100}
          maxY={260}
          unit="Wh/km"
          series={[
            { id: "sessions", name: "Avg Wh/km", color: "#10b981", data: efficiencyHistory },
          ]}
        />
      </div>
    </div>
  );
}
