"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AreaChartProps {
  data: { label: string; value: number }[];
  color?: string;
  fillOpacity?: number;
  height?: number;
  className?: string;
  unit?: string;
}

export function AreaChart({
  data,
  color = "#38bdf8",
  fillOpacity = 0.2,
  height = 180,
  className,
  unit = "",
}: AreaChartProps) {
  if (!data.length) return null;

  const width = 600;
  const paddingX = 30;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 10);
  const valRange = maxVal - minVal || 1;

  const getX = (i: number) => paddingX + (i / (data.length - 1)) * chartWidth;
  const getY = (v: number) => height - paddingY - ((v - minVal) / valRange) * chartHeight;

  let linePath = `M ${getX(0)} ${getY(data[0].value)}`;
  for (let i = 1; i < data.length; i++) {
    const prevX = getX(i - 1);
    const prevY = getY(data[i - 1].value);
    const currX = getX(i);
    const currY = getY(data[i].value);
    const midX = (prevX + currX) / 2;
    linePath += ` C ${midX} ${prevY}, ${midX} ${currY}, ${currX} ${currY}`;
  }

  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;
  const gradientId = `areaGrad-${color.replace("#", "")}`;

  return (
    <div className={cn("w-full overflow-hidden select-none", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Base Grid */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
