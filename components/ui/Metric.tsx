import React from "react";
import { cn } from "@/lib/utils";

export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  comparison?: string;
  comparisonType?: "positive" | "negative" | "neutral" | "warning";
  status?: string;
  statusType?: "optimal" | "warning" | "alert" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function Metric({
  className,
  label,
  value,
  unit,
  icon,
  comparison,
  comparisonType = "neutral",
  status,
  statusType = "neutral",
  size = "md",
  ...props
}: MetricProps) {
  const comparisonColor = {
    positive: "text-emerald-400",
    negative: "text-rose-400",
    warning: "text-amber-400",
    neutral: "text-slate-400",
  }[comparisonType];

  const statusColor = {
    optimal: "text-emerald-400",
    warning: "text-amber-400",
    alert: "text-rose-400",
    neutral: "text-slate-400",
  }[statusType];

  const valueSizeClass = {
    sm: "text-[22px]",
    md: "text-[30px] sm:text-[34px]",
    lg: "text-[42px]",
  }[size];

  return (
    <div
      className={cn(
        "rounded-2xl glass-panel p-4 flex flex-col justify-between hover:border-white/[0.12] transition-all min-h-[135px]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-slate-400 mb-1">
        <span className="text-[10px] uppercase font-mono tracking-wider font-medium text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="my-1.5 flex items-baseline">
        <span className={cn("font-semibold text-white tracking-tight font-mono tabular-nums leading-none", valueSizeClass)}>
          {value}
        </span>
        {unit && <span className="text-[12px] text-slate-400 font-mono ml-1.5">{unit}</span>}
      </div>

      <div className="flex items-start justify-between text-[10px] font-mono mt-2 pt-2 border-t border-white/[0.04] gap-2 leading-tight">
        {comparison && <span className={comparisonColor}>{comparison}</span>}
        {status && <span className={cn("ml-auto font-medium text-right", statusColor)}>{status}</span>}
      </div>
    </div>
  );
}
