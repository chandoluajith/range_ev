"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface DistributionSegment {
  id: string;
  label: string;
  percentage: number;
  color: string;
  valueDescription?: string;
}

export interface DistributionChartProps {
  segments: DistributionSegment[];
  className?: string;
}

export function DistributionChart({ segments, className }: DistributionChartProps) {
  return (
    <div className={cn("flex flex-col gap-3 font-mono", className)}>
      {/* Segmented multi-colored bar */}
      <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden flex border border-white/[0.06]">
        {segments.map((seg) => (
          <div
            key={seg.id}
            title={`${seg.label}: ${seg.percentage}%`}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${seg.percentage}%`,
              backgroundColor: seg.color,
            }}
          />
        ))}
      </div>

      {/* Legend & Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-[11px] font-sans text-slate-300 truncate max-w-[130px]">
                {seg.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-white">{seg.percentage}%</span>
              {seg.valueDescription && (
                <span className="text-[10px] text-slate-400">({seg.valueDescription})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
