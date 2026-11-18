"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Radio,
  Zap,
  Compass,
  Activity,
  Cpu,
  Layers,
  Settings,
  ChevronRight,
  Car,
} from "lucide-react";
import { NAV_ITEMS, APP_NAME, APP_VERSION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Gauge":
        return <Gauge className="w-[18px] h-[18px]" />;
      case "Radio":
        return <Radio className="w-[18px] h-[18px]" />;
      case "Zap":
        return <Zap className="w-[18px] h-[18px]" />;
      case "Compass":
        return <Compass className="w-[18px] h-[18px]" />;
      case "Activity":
        return <Activity className="w-[18px] h-[18px]" />;
      case "Cpu":
        return <Cpu className="w-[18px] h-[18px]" />;
      case "Layers":
        return <Layers className="w-[18px] h-[18px]" />;
      case "Settings":
        return <Settings className="w-[18px] h-[18px]" />;
      case "Car":
        return <Car className="w-[18px] h-[18px]" />;
      default:
        return <Gauge className="w-[18px] h-[18px]" />;
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-[#090c12]/85 backdrop-blur-2xl z-50 flex flex-col justify-between border-r border-white/[0.06] shadow-[4px_0_30px_rgba(0,0,0,0.6)] transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-sky-400/20 to-sky-600/5 border border-sky-400/25 flex items-center justify-center text-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.25)] group-hover:scale-105 transition-all">
                <Zap className="w-4 h-4 fill-sky-400/30" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white tracking-tight text-[15px] leading-tight font-sans">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  PORSCHE OS · TAYCAN
                </span>
              </div>
            </Link>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-400/25 text-sky-400 tracking-widest uppercase font-mono font-semibold">
              PINN-ML
            </span>
          </div>

          <div className="flex items-center gap-1.5 pl-10">
            <span className="text-[11px] text-slate-400 font-mono">
              {APP_VERSION}
            </span>
          </div>
        </div>

        <div className="px-5 py-1">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 py-3 font-mono text-[13px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isHighlighted = (item as { highlight?: boolean }).highlight;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 group",
                  isActive
                    ? isHighlighted
                      ? "bg-sky-500/20 text-white font-semibold border-2 border-sky-400/50 shadow-[0_0_16px_rgba(56,189,248,0.3),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
                      : "bg-sky-500/10 text-white font-medium border border-sky-400/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                    : isHighlighted
                    ? "text-sky-300 bg-sky-500/10 hover:bg-sky-500/15 border border-sky-400/30 hover:border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-sky-400"
                      : isHighlighted
                      ? "text-sky-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {getIcon(item.icon)}
                </span>
                <span className={cn("font-sans text-[13px]", isHighlighted ? "font-semibold" : "font-medium")}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider",
                      isHighlighted
                        ? "bg-sky-400 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                        : "bg-sky-500/10 text-sky-400 border border-sky-400/20"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Operator Profile & Theme Switcher */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-sky-300 text-[11px] font-mono font-semibold">
              AV
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-white font-medium leading-none">
                Dr. A. Vance
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none mt-1">
                Telemetry Lead
              </span>
            </div>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </div>
    </aside>
  );
}
