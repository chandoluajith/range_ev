"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ComparisonItem {
  label: string;
  baseline: number;
  hybrid: number;
  unit?: string;
}

export interface ComparisonChartProps {
  items: ComparisonItem[];
  baselineName?: string;
  hybridName?: string;
  className?: string;
}

export function ComparisonChart({
  items,
  baselineName = "Physics Model",
  hybridName = "ML Adjusted",
  className,
}: ComparisonChartProps) {
  const allValues = items.flatMap((i) => [i.baseline, i.hybrid]);
  const maxVal = Math.max(...allValues, 100);

  return (
    <div className={cn("flex flex-col gap-3 font-mono", className)}>
      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
          <span className="text-slate-400">{baselineName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
          <span className="text-sky-400">{hybridName}</span>
        </div>
      </div>

      {items.map((item, idx) => {
        const baseWidth = (item.baseline / maxVal) * 100;
        const hybridWidth = (item.hybrid / maxVal) * 100;

        return (
          <div key={idx} className="flex flex-col gap-1 p-2 rounded-xl bg-white/[0.02]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-sans">{item.label}</span>
              <span className="text-white">
                {item.hybrid} {item.unit || "Wh/km"}{" "}
                <span className="text-slate-500 font-normal">
                  (vs {item.baseline})
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-1 mt-0.5">
              {/* Baseline Bar */}
              <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full opacity-70"
                  style={{ width: `${baseWidth}%` }}
                />
              </div>

              {/* Hybrid Bar */}
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-full shadow-[0_0_8px_rgba(56,189,248,0.35)]"
                  style={{ width: `${hybridWidth}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
