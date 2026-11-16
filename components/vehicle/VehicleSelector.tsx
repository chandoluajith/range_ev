"use client";

import React, { useState, useRef, useEffect } from "react";
import { Car, ChevronDown, Check } from "lucide-react";
import { DEFAULT_VEHICLES } from "@/lib/constants";
import { VehicleProfile } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
  currentVehicle: VehicleProfile;
  onSelectVehicle: (id: string) => void;
}

export function VehicleSelector({
  currentVehicle,
  onSelectVehicle,
}: VehicleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.14] transition-all cursor-pointer text-left"
        type="button"
      >
        <Car className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[11px] text-white font-mono truncate max-w-[150px] sm:max-w-[210px]">
          {currentVehicle.name} ({currentVehicle.batteryCapacityKWh} kWh)
        </span>
        <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-white/[0.06] mb-1">
            Active Calibrated Fleet
          </div>

          <div className="flex flex-col gap-1">
            {DEFAULT_VEHICLES.map((vehicle) => {
              const isSelected = vehicle.id === currentVehicle.id;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    onSelectVehicle(vehicle.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl text-left transition-all",
                    isSelected
                      ? "bg-sky-500/10 border border-sky-400/25 text-white"
                      : "hover:bg-white/[0.04] text-slate-300 hover:text-white"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium font-sans">{vehicle.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {vehicle.batteryCapacityKWh} kWh · Cd {vehicle.dragCoefficientCd} · {vehicle.curbWeightKg} kg
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
