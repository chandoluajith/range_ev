"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Settings,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { VehicleProfile } from "@/types/vehicle";
import { DEFAULT_VEHICLES } from "@/lib/constants";

interface TopbarProps {
  onToggleSidebar?: () => void;
  currentVehicle?: VehicleProfile;
  onSelectVehicle?: (id: string) => void;
}

export function Topbar({
  onToggleSidebar,
  currentVehicle = DEFAULT_VEHICLES[0],
  onSelectVehicle = () => {},
}: TopbarProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#08090c]/80 backdrop-blur-2xl border-b border-white/[0.06] z-40 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-colors duration-200">
      {/* Left side: Hamburger on mobile + Title & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white"
          type="button"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none">
            AERODYNAMIC &amp; THERMAL TELEMETRY
          </span>
          <span className="text-[14px] sm:text-[15px] text-white font-medium tracking-tight mt-1 leading-none">
            Personalized EV Intelligence Console
          </span>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Indicator */}
        <Badge variant="success" size="md" dot pulse className="hidden sm:inline-flex">
          LIVE INFERENCE · 100Hz
        </Badge>

        {/* Current Trip route */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300">
          <Navigation className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] text-slate-300 font-mono tracking-tight">
            Trip #842: Innsbruck → Munich
          </span>
        </div>

        {/* Vehicle Selector */}
        <VehicleSelector
          currentVehicle={currentVehicle}
          onSelectVehicle={onSelectVehicle}
        />

        {/* Dark/Light Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Settings Action Icon */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center border border-transparent hover:border-white/[0.08]"
          title="System Configuration & Simulation Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-sky-300 text-slate-950 font-semibold text-[11px] flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.3)]">
          AV
        </div>
      </div>
    </header>
  );
}
