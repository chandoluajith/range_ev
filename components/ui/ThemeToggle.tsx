"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({
  className,
  showLabels = false,
  size = "md",
}: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering default dark state before client mount
  const isLight = mounted && theme === "light";

  const sizeConfigs = {
    sm: {
      container: "h-7 w-14 p-0.5",
      thumb: "w-5 h-5",
      thumbLeftDark: "left-0.5",
      thumbLeftLight: "left-[calc(100%-1.375rem)]",
      iconSize: "w-3 h-3",
    },
    md: {
      container: "h-8 w-16 p-1",
      thumb: "w-6 h-6",
      thumbLeftDark: "left-1",
      thumbLeftLight: "left-[calc(100%-1.75rem)]",
      iconSize: "w-3.5 h-3.5",
    },
    lg: {
      container: "h-9 w-20 p-1",
      thumb: "w-7 h-7",
      thumbLeftDark: "left-1",
      thumbLeftLight: "left-[calc(100%-2rem)]",
      iconSize: "w-4 h-4",
    },
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        onClick={toggleTheme}
        aria-label={isLight ? "Switch to Obsidian Dark mode" : "Switch to Studio Light mode"}
        title={isLight ? "Switch to Obsidian Dark Mode" : "Switch to Studio Light Mode"}
        className={cn(
          "relative inline-flex items-center rounded-full select-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/40",
          sizeConfigs.container,
          // Track appearance (Dark mode)
          "bg-[#0a0d14] border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] hover:border-white/20",
          // Track appearance (Light mode via html.light)
          "html-light-toggle"
        )}
      >
        {/* Background Inactive / Stationary Icons */}
        <div className="w-full flex items-center justify-between px-1.5 pointer-events-none select-none">
          {/* Moon icon in left slot */}
          <Moon
            className={cn(
              "transition-opacity duration-200 text-slate-400",
              sizeConfigs.iconSize,
              isLight ? "opacity-70" : "opacity-0"
            )}
          />
          {/* Sun icon in right slot */}
          <Sun
            className={cn(
              "transition-opacity duration-200 text-amber-500",
              sizeConfigs.iconSize,
              isLight ? "opacity-0" : "opacity-60"
            )}
          />
        </div>

        {/* Sliding Active Pill Thumb */}
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center shadow-lg",
            sizeConfigs.thumb,
            isLight
              ? `${sizeConfigs.thumbLeftLight} bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 shadow-[0_2px_10px_rgba(245,158,11,0.5)]`
              : `${sizeConfigs.thumbLeftDark} bg-gradient-to-tr from-sky-500 to-sky-400 text-slate-950 shadow-[0_2px_10px_rgba(56,189,248,0.45)]`
          )}
        >
          {isLight ? (
            <Sun className={cn(sizeConfigs.iconSize, "transition-transform duration-500 rotate-90")} />
          ) : (
            <Moon className={cn(sizeConfigs.iconSize, "transition-transform duration-300 -rotate-12")} />
          )}
        </span>
      </button>

      {showLabels && (
        <span className="text-[12px] font-mono tracking-tight text-slate-300 transition-colors">
          {isLight ? "Studio Light" : "Obsidian Dark"}
        </span>
      )}
    </div>
  );
}
