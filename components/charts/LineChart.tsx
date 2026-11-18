"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface LineSeries {
  id: string;
  name: string;
  color: string;
  dashed?: boolean;
  data: number[];
  highlight?: boolean;
  strokeWidth?: number;
}

export interface LineChartProps {
  series: LineSeries[];
  labels: string[];
  unit?: string;
  height?: number;
  minY?: number;
  maxY?: number;
  className?: string;
}

export function LineChart({
  series,
  labels,
  unit = "",
  height = 200,
  minY,
  maxY,
  className,
}: LineChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Derive min/max
  const allValues = series.flatMap((s) => s.data);
  const calculatedMin = minY !== undefined ? minY : Math.min(...allValues, 0);
  const calculatedMax = maxY !== undefined ? maxY : Math.max(...allValues, 100);
  const range = calculatedMax - calculatedMin || 1;

  const width = 800;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getX = (i: number) => paddingX + (i / (labels.length - 1)) * chartWidth;
  const getY = (val: number) =>
    height - paddingY - ((val - calculatedMin) / range) * chartHeight;

  return (
    <div className={cn("relative w-full overflow-hidden select-none", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Horizontal gridlines */}
        {[0, 0.5, 1].map((pct, i) => {
          const val = calculatedMin + pct * range;
          const y = getY(val);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-500"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Series paths */}
        {series.map((s) => {
          if (s.data.length < 2) return null;
          let d = `M ${getX(0)} ${getY(s.data[0])}`;
          for (let i = 1; i < s.data.length; i++) {
            const x = getX(i);
            const y = getY(s.data[i]);
            d += ` L ${x} ${y}`;
          }

          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={s.strokeWidth ?? (s.highlight ? 3.5 : 2)}
              strokeDasharray={s.dashed ? "4 4" : "0"}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={s.highlight ? { filter: `drop-shadow(0 0 8px ${s.color}cc)` } : undefined}
            />
          );
        })}

        {/* Highlighted series data points */}
        {series.map((s) => {
          if (!s.highlight) return null;
          return s.data.map((val, i) => (
            <circle
              key={`${s.id}-dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r="3.5"
              fill={s.color}
              stroke="#08090c"
              strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
            />
          ));
        })}
      </svg>

      {/* Bottom Labels */}
      <div className="flex justify-between px-10 text-[10px] font-mono text-slate-500 pt-1">
        <span>{labels[0]}</span>
        <span>{labels[Math.floor(labels.length / 2)]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
