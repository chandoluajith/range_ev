import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "primary",
  size = "sm",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-sky-500/10 text-sky-400 border-sky-400/20",
    secondary: "bg-teal-500/10 text-teal-400 border-teal-400/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    neutral: "bg-white/[0.04] text-slate-300 border-white/[0.07]",
    outline: "bg-transparent text-slate-400 border-white/[0.1]",
  };

  const dotColors = {
    primary: "bg-sky-400 shadow-[0_0_6px_#38bdf8]",
    secondary: "bg-teal-400 shadow-[0_0_6px_#2dd4bf]",
    success: "bg-emerald-400 shadow-[0_0_6px_#10b981]",
    warning: "bg-amber-400 shadow-[0_0_6px_#f59e0b]",
    error: "bg-rose-400 shadow-[0_0_6px_#f43f5e]",
    neutral: "bg-slate-400",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1.5",
    md: "px-2.5 py-1 text-[11px] gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded-full border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant].split(" ")[0]
              )}
            />
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])} />
        </span>
      )}
      {children}
    </span>
  );
}
