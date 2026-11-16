"use client";

import React from "react";
import { X, Navigation, Mountain, Zap, Activity, Clock, ShieldCheck, Gauge } from "lucide-react";
import { TripDetail } from "@/types/trip";
import { Badge } from "@/components/ui/Badge";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { AreaChart } from "@/components/charts/AreaChart";

interface TripDetailsProps {
  trip: TripDetail | null;
  onClose: () => void;
}

export function TripDetails({ trip, onClose }: TripDetailsProps) {
  if (!trip) return null;

  const lossSegments = [
    { id: "aero", label: "Aero Drag Force", percentage: 48, color: "#38bdf8", valueDescription: `${trip.telemetrySliceSummary.aeroDragKWh} kWh` },
    { id: "rolling", label: "Rolling Resistance", percentage: 22, color: "#94a3b8", valueDescription: `${trip.telemetrySliceSummary.rollingResistanceKWh} kWh` },
    { id: "grade", label: "Topographic Work", percentage: 11, color: "#f59e0b", valueDescription: `${trip.telemetrySliceSummary.gravitationalNetKWh} kWh` },
    { id: "aux", label: "Aux & HVAC Draw", percentage: 13, color: "#818cf8", valueDescription: `${trip.telemetrySliceSummary.auxHVACKWh} kWh` },
    { id: "loss", label: "Inverter & Core Loss", percentage: 6, color: "#f43f5e", valueDescription: `${trip.telemetrySliceSummary.powertrainLossKWh} kWh` },
  ];

  const elevationChartData = trip.elevationProfile.map((ep) => ({
    label: `${ep.km} km`,
    value: ep.elevationM,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-full bg-[#0d1017] border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/25 flex items-center justify-center text-sky-400">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-white font-sans">
                  {trip.code}: {trip.routeName}
                </span>
                <Badge variant={trip.status === "Verified" ? "success" : "neutral"} size="sm">
                  {trip.status}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                {trip.vehicleName} · {trip.dateFormatted} ({trip.durationFormatted})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.06] transition-all cursor-pointer"
            aria-label="Close trip drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Distance</span>
            <div className="text-[18px] font-semibold text-white mt-0.5">{trip.distanceKm} km</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Avg Consumption</span>
            <div className="text-[18px] font-semibold text-sky-400 mt-0.5">{trip.avgConsumptionWhKm} Wh/km</div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Range Error</span>
            <div className={`text-[18px] font-semibold mt-0.5 ${trip.rangeErrorPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {trip.rangeErrorPercent >= 0 ? `+${trip.rangeErrorPercent}%` : `${trip.rangeErrorPercent}%`}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase font-sans">Regen Energy</span>
            <div className="text-[18px] font-semibold text-emerald-400 mt-0.5">{trip.regenEnergyKWh} kWh</div>
          </div>
        </div>

        {/* Prediction Convergence Evaluation */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.05] mb-5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300 font-medium">Model Calibration Analysis</span>
            <span className="text-emerald-400">PINN Residual Convergence</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[11px] font-mono">
            <div>
              <span className="text-slate-400">Predicted Range:</span>
              <div className="text-white font-semibold">{trip.predictedRangeKm} km</div>
            </div>
            <div>
              <span className="text-slate-400">Actual Realized:</span>
              <div className="text-white font-semibold">{trip.actualRangeKm} km</div>
            </div>
            <div>
              <span className="text-slate-400">Variance:</span>
              <div className="text-sky-400 font-semibold">
                {Math.abs(trip.predictedRangeKm - trip.actualRangeKm)} km drift
              </div>
            </div>
          </div>
        </div>

        {/* Elevation Profile Visualization */}
        <div className="mb-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white font-sans">
              Topographic Elevation Profile
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Climb: +{trip.elevationGainM}m ({trip.startElevationM}m → {trip.endElevationM}m)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.04]">
            <AreaChart data={elevationChartData} color="#f59e0b" fillOpacity={0.15} height={130} />
          </div>
        </div>

        {/* Energy Loss Decomposition */}
        <div className="mb-5 flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-white font-sans">
            Kinematic &amp; Aerodynamic Loss Breakdown
          </span>
          <DistributionChart segments={lossSegments} />
        </div>

        {/* Speed Distribution Array */}
        <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Mean velocity: {trip.avgSpeedKmh} km/h (Peak {trip.maxSpeedKmh} km/h)</span>
          <span className="text-emerald-400">Regen rate: {trip.regenRatePercent}%</span>
        </div>
      </div>
    </div>
  );
}
