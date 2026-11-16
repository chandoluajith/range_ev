import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle" | "inset";
  glow?: "blue" | "emerald" | "amber" | "none";
}

export function Card({
  className,
  variant = "default",
  glow = "none",
  children,
  ...props
}: CardProps) {
  const variantClass = {
    default: "glass-panel",
    elevated: "glass-panel-elevated",
    subtle: "glass-panel-subtle",
    inset: "glass-panel-inset",
  }[variant];

  const glowEffects = {
    blue: "relative before:absolute before:-top-16 before:-right-16 before:w-48 before:h-48 before:bg-sky-500/10 before:rounded-full before:blur-3xl before:pointer-events-none",
    emerald: "relative before:absolute before:-top-16 before:-right-16 before:w-48 before:h-48 before:bg-emerald-500/10 before:rounded-full before:blur-3xl before:pointer-events-none",
    amber: "relative before:absolute before:-top-16 before:-right-16 before:w-48 before:h-48 before:bg-amber-500/10 before:rounded-full before:blur-3xl before:pointer-events-none",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "rounded-2xl p-5 md:p-6 transition-all duration-200 overflow-hidden",
        variantClass,
        glowEffects,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-[16px] font-semibold text-white tracking-tight font-sans", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[12px] text-slate-400 font-sans mt-0.5", className)} {...props}>
      {children}
    </p>
  );
}
