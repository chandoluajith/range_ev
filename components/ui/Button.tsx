import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isActive?: boolean;
}

export function Button({
  className,
  variant = "glass",
  size = "md",
  isActive = false,
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-[0_0_16px_rgba(56,189,248,0.35)] border border-sky-300/30",
    secondary:
      "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-[0_0_16px_rgba(16,185,129,0.3)] border border-emerald-300/30",
    glass:
      "bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.07] hover:border-white/[0.15] shadow-sm",
    ghost:
      "bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-transparent",
    danger:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30",
  };

  const activeStyles = isActive
    ? "bg-sky-500/15 text-sky-400 border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
    : "";

  const sizeStyles = {
    sm: "px-2.5 py-1 text-[11px] rounded-lg gap-1.5 font-mono",
    md: "px-3.5 py-1.5 text-[12px] rounded-lg gap-2",
    lg: "px-4 py-2 text-[14px] rounded-xl gap-2.5 font-medium",
    icon: "w-8 h-8 rounded-lg flex items-center justify-center p-0",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400",
        sizeStyles[size],
        variantStyles[variant],
        activeStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
