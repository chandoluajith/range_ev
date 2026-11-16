import React from "react";
import { VehicleProfile, VehicleState } from "@/types/vehicle";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Wifi, BatteryCharging, Zap } from "lucide-react";

interface VehicleStatusProps {
  vehicle: VehicleProfile;
  state: VehicleState;
}

export function VehicleStatus({ vehicle, state }: VehicleStatusProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl glass-panel text-[11px] font-mono">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">VIN:</span>
        <span className="text-slate-200">{vehicle.vin}</span>
      </div>

      <div className="h-3 w-px bg-white/[0.08] hidden sm:block" />

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Platform:</span>
        <span className="text-slate-200">{vehicle.nominalVoltage}V Architecture</span>
      </div>

      <div className="h-3 w-px bg-white/[0.08] hidden sm:block" />

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Battery:</span>
        <span className="text-sky-300 font-semibold">{vehicle.usableCapacityKWh} kWh Net</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant={state.simulationMode ? "warning" : "success"} size="sm" dot pulse>
          {state.simulationMode ? "Simulation Mode: ON" : "CAN Bus: LIVE"}
        </Badge>
      </div>
    </div>
  );
}
