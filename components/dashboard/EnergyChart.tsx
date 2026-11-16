"use client";

import React, { useState, useRef } from "react";
import { LineChart, Sparkles } from "lucide-react";
import { TelemetryPoint } from "@/types/telemetry";
import { Button } from "@/components/ui/Button";

interface EnergyChartProps {
  data: TelemetryPoint[];
  timeWindow: "5 min" | "15 min" | "30 min" | "Trip";
  onSelectTimeWindow: (w: "5 min" | "15 min" | "30 min" | "Trip") => void;
}

export function EnergyChart({
  data,
  timeWindow,
  onSelectTimeWindow,
}: EnergyChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback to active/middle point if not hovered
  const activeIndex = hoverIndex !== null ? hoverIndex : Math.floor(data.length * 0.68);
  const activePoint = data[activeIndex] || data[data.length - 1];

  // SVG Chart bounds
  const width = 1000;
  const height = 280;
  const paddingX = 60;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Min/max scale for Wh/km: 0 to 260
  const minY = 0;
  const maxY = 260;

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return height - paddingY - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  const getX = (idx: number) => {
    if (data.length <= 1) return paddingX;
    return paddingX + (idx / (data.length - 1)) * chartWidth;
  };

  // Generate smooth SVG paths
  const generatePath = (selector: (p: TelemetryPoint) => number) => {
    if (!data.length) return "";
    let d = `M ${getX(0)} ${getY(selector(data[0]))}`;
    for (let i = 1; i < data.length; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(selector(data[i - 1]));
      const currX = getX(i);
      const currY = getY(selector(data[i]));
      const midX = (prevX + currX) / 2;
      d += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
    }
    return d;
  };

  const actualPath = generatePath((p) => p.actualWhKm);
  const physicsPath = generatePath((p) => p.physicsWhKm);
  const mlPath = generatePath((p) => p.mlAdjustedWhKm);

  // Area glow path for actual
  const actualAreaPath = actualPath
    ? `${actualPath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`
    : "";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (mouseX - (paddingX / width) * rect.width) / ((chartWidth / width) * rect.width)));
    const targetIdx = Math.round(ratio * (data.length - 1));
    setHoverIndex(targetIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoverXCoord = getX(activeIndex);
  const hoverXPercent = (hoverXCoord / width) * 100;

  return (
    <section className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
      {/* Header with Toggles & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LineChart className="w-5 h-5 text-sky-400" />
            <h2 className="text-[17px] font-semibold text-white tracking-tight font-sans">
              Energy Consumption
            </h2>
          </div>
          <p className="text-[12px] text-slate-400 mt-0.5 font-sans">
            Current trip energy behavior • 100 Hz downsampled to 1 Hz CAN resolution
          </p>
        </div>

        {/* Time Window Buttons & Legends */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-black/40 border border-white/[0.06] p-0.5 rounded-xl text-[11px] font-mono">
            {(["5 min", "15 min", "30 min", "Trip"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onSelectTimeWindow(w)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeWindow === w
                    ? "bg-white/[0.1] text-white font-medium border border-white/[0.08] shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />

          {/* Legend Chips */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="w-2.5 h-1 bg-sky-400 rounded-full shadow-[0_0_6px_#38bdf8]" />
              <span className="text-white">Actual (CAN)</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="w-2.5 h-0.5 bg-slate-400 border-b border-dashed border-slate-300" />
              <span className="text-slate-400">Physics Model</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="w-2.5 h-1 bg-emerald-400 rounded-full shadow-[0_0_6px_#10b981]" />
              <span className="text-emerald-400">ML Adjusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SVG Canvas Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-80 bg-black/40 border border-white/[0.05] rounded-xl overflow-hidden p-2 flex flex-col justify-end select-none cursor-crosshair"
      >
        {/* Hover Crosshair Line */}
        <div
          className="absolute top-0 bottom-7 w-px bg-gradient-to-b from-sky-400/50 via-emerald-400/50 to-transparent pointer-events-none z-20 transition-all duration-75"
          style={{ left: `${hoverXPercent}%` }}
        />

        {/* VisionOS Floating Tooltip */}
        <div
          className="absolute top-4 z-30 pointer-events-none bg-slate-900/90 backdrop-blur-2xl p-3.5 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex flex-col gap-1.5 w-64 border border-white/[0.12] transition-all duration-75"
          style={{
            left: `${Math.max(18, Math.min(82, hoverXPercent))}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/[0.08] pb-1.5">
            <span className="text-emerald-400 font-semibold">T: {activePoint.timestamp}</span>
            <span className="text-slate-300">
              {activePoint.speed} km/h · {activePoint.roadGradient >= 0 ? "+" : ""}{activePoint.roadGradient}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono pt-0.5">
            <span className="text-slate-400">Battery SOC:</span>
            <span className="text-white text-right font-medium">{activePoint.soc}%</span>

            <span className="text-slate-400">Traction Power:</span>
            <span className="text-white text-right font-medium">{activePoint.motorPower} kW</span>

            <span className="text-sky-400 font-medium">Actual Wh/km:</span>
            <span className="text-sky-300 text-right font-semibold">{activePoint.actualWhKm} Wh/km</span>

            <span className="text-slate-400">Physics Modeled:</span>
            <span className="text-slate-400 text-right">{activePoint.physicsWhKm} Wh/km</span>

            <span className="text-emerald-400 font-medium">ML Adjusted:</span>
            <span className="text-emerald-300 text-right font-semibold">{activePoint.mlAdjustedWhKm} Wh/km</span>
          </div>
        </div>

        {/* SVG Drawing */}
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="mlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Horizontal Lines */}
          {[250, 200, 150, 100, 0].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={level === 150 ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.04)"}
                  strokeWidth="1"
                  strokeDasharray={level === 150 ? "4 4" : "0"}
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-500"
                >
                  {level === 0 ? "0 (Regen)" : level}
                </text>
              </g>
            );
          })}

          {/* Area Fills */}
          <path d={actualAreaPath} fill="url(#actualGradient)" />

          {/* Physics Model Baseline (Dashed Slate) */}
          <path
            d={physicsPath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            opacity="0.65"
          />

          {/* ML Adjusted Estimate (Solid Emerald Glow) */}
          <path
            d={mlPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))"
          />

          {/* Actual CAN Consumption (Glacial Cyan Laser) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.45))"
          />

          {/* Intersect Point Indicators at active hovered point */}
          <circle
            cx={hoverXCoord}
            cy={getY(activePoint.physicsWhKm)}
            r="3"
            fill="#08090c"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <circle
            cx={hoverXCoord}
            cy={getY(activePoint.mlAdjustedWhKm)}
            r="4"
            fill="#08090c"
            stroke="#10b981"
            strokeWidth="2"
          />
          <circle
            cx={hoverXCoord}
            cy={getY(activePoint.actualWhKm)}
            r="4.5"
            fill="#38bdf8"
            stroke="#08090c"
            strokeWidth="2"
          />
        </svg>

        {/* Time Axis Markers */}
        <div className="flex justify-between items-center px-12 pt-2 text-[10px] font-mono text-slate-500 border-t border-white/[0.04]">
          <span>{data[0]?.timestamp || "14:00"} (Start)</span>
          <span>{data[Math.floor(data.length * 0.25)]?.timestamp || "14:08"}</span>
          <span>{data[Math.floor(data.length * 0.5)]?.timestamp || "14:16"}</span>
          <span className="text-emerald-400 font-medium">
            {activePoint?.timestamp} (Scrubbed Point)
          </span>
          <span>{data[data.length - 1]?.timestamp || "14:32"} (Horizon)</span>
        </div>
      </div>
    </section>
  );
}
