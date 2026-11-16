"use client";

import React, { useState } from "react";
import {
  Settings,
  Car,
  Sliders,
  Database,
  Monitor,
  RotateCcw,
  Check,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useVehicle } from "@/hooks/useVehicle";
import { useTheme } from "@/hooks/useTheme";

export default function SettingsPage() {
  const {
    vehicles,
    currentVehicle,
    vehicleState,
    selectVehicle,
    toggleSimulationMode,
    updatePhysicsParams,
    resetToNominal,
  } = useVehicle();
  const { theme, setTheme } = useTheme();

  // Local state for settings form
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [samplingRate, setSamplingRate] = useState<"100" | "50" | "10">("100");
  const [chartSmoothing, setChartSmoothing] = useState<boolean>(true);
  const [glowEffects, setGlowEffects] = useState<boolean>(true);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  // Editable vehicle physics parameters
  const [mass, setMass] = useState(currentVehicle.curbWeightKg);
  const [cd, setCd] = useState(currentVehicle.dragCoefficientCd);
  const [frontalArea, setFrontalArea] = useState(currentVehicle.frontalAreaM2);
  const [crr, setCrr] = useState(currentVehicle.rollingResistanceCrr);
  const [efficiency, setEfficiency] = useState(Math.round(currentVehicle.drivetrainEfficiency * 100));

  const handleSavePhysics = () => {
    updatePhysicsParams({
      curbWeightKg: mass,
      dragCoefficientCd: cd,
      frontalAreaM2: frontalArea,
      rollingResistanceCrr: crr,
      drivetrainEfficiency: efficiency / 100,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleResetDefaults = () => {
    resetToNominal();
    setMass(currentVehicle.curbWeightKg);
    setCd(currentVehicle.dragCoefficientCd);
    setFrontalArea(currentVehicle.frontalAreaM2);
    setCrr(currentVehicle.rollingResistanceCrr);
    setEfficiency(Math.round(currentVehicle.drivetrainEfficiency * 100));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
            System Settings &amp; Configuration
          </h1>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Hardware data sources, telemetry simulation mode, unit preferences, and physics constants
          </p>
        </div>

        {savedNotice && (
          <Badge variant="success" size="md" className="gap-1.5 self-start">
            <Check className="w-3.5 h-3.5" />
            <span>Parameters Synced</span>
          </Badge>
        )}
      </div>

      {/* Section 1: Simulation Mode Notice & Switch */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4 border-amber-500/20 bg-amber-500/[0.02]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-white font-sans">
                Simulation Mode: {vehicleState.simulationMode ? "ON" : "OFF"}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                The current frontend runs in high-fidelity mock &amp; simulation mode because real-vehicle CAN hardware is not connected.
              </span>
            </div>
          </div>

          <button
            onClick={toggleSimulationMode}
            type="button"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              vehicleState.simulationMode ? "bg-sky-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                vehicleState.simulationMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 2: Active Vehicle Fleet Profile */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-400" />
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Vehicle Profile
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {currentVehicle.nominalVoltage}V Powertrain Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {vehicles.map((v) => {
            const isSelected = v.id === currentVehicle.id;
            return (
              <div
                key={v.id}
                onClick={() => selectVehicle(v.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-sky-500/10 border-sky-400/40 shadow-[0_0_16px_rgba(56,189,248,0.15)]"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-white font-sans">{v.name}</span>
                  {isSelected && <Badge variant="primary" size="sm">Active</Badge>}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-2 flex flex-col gap-0.5">
                  <span>Battery: {v.batteryCapacityKWh} kWh ({v.usableCapacityKWh} kWh Usable)</span>
                  <span>Motor: {v.maxMotorPowerKW} kW · Regen: {v.maxRegenPowerKW} kW</span>
                  <span>Curb Weight: {v.curbWeightKg} kg · EPA Range: {v.eparangeKm} km</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Physics Model Calibration Editor */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Physics Model Parameters
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleResetDefaults} className="gap-1 text-[11px]">
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </Button>
        </div>

        <p className="text-[12px] text-slate-400 font-sans -mt-2">
          Calibrate first-principles kinematic constants used for rolling resistance, aerodynamic drag, and powertrain efficiency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase">Curb Weight (kg)</span>
            <input
              type="number"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
              className="bg-transparent border-b border-white/[0.1] text-white text-[16px] font-semibold focus:outline-none focus:border-sky-400"
            />
            <span className="text-[10px] text-slate-500">Nominal 2,310 kg</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase">Drag Coefficient (Cd)</span>
            <input
              type="number"
              step="0.005"
              value={cd}
              onChange={(e) => setCd(parseFloat(e.target.value) || 0)}
              className="bg-transparent border-b border-white/[0.1] text-white text-[16px] font-semibold focus:outline-none focus:border-sky-400"
            />
            <span className="text-[10px] text-slate-500">Nominal 0.22 Cd</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase">Frontal Area (A, m²)</span>
            <input
              type="number"
              step="0.01"
              value={frontalArea}
              onChange={(e) => setFrontalArea(parseFloat(e.target.value) || 0)}
              className="bg-transparent border-b border-white/[0.1] text-white text-[16px] font-semibold focus:outline-none focus:border-sky-400"
            />
            <span className="text-[10px] text-slate-500">Nominal 2.33 m²</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase">Rolling Resistance (Crr)</span>
            <input
              type="number"
              step="0.0005"
              value={crr}
              onChange={(e) => setCrr(parseFloat(e.target.value) || 0)}
              className="bg-transparent border-b border-white/[0.1] text-white text-[16px] font-semibold focus:outline-none focus:border-sky-400"
            />
            <span className="text-[10px] text-slate-500">Nominal 0.0095</span>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-[10px] text-slate-400 uppercase">Drivetrain Efficiency (%)</span>
            <input
              type="number"
              value={efficiency}
              onChange={(e) => setEfficiency(parseFloat(e.target.value) || 0)}
              className="bg-transparent border-b border-white/[0.1] text-white text-[16px] font-semibold focus:outline-none focus:border-sky-400"
            />
            <span className="text-[10px] text-slate-500">Inverter + Gearbox (94%)</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSavePhysics}
          className="self-end mt-2"
        >
          Apply Physics Changes
        </Button>
      </div>

      {/* Section 4: Display & Engineering Units */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-sky-400" />
          <h3 className="text-[16px] font-semibold text-white font-sans">
            Display &amp; Engineering Units
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] font-mono">
          {/* Theme Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/30 border border-white/[0.04] sm:col-span-2">
            <div className="flex flex-col">
              <span className="text-white font-medium">Theme Appearance</span>
              <span className="text-[11px] text-slate-400">
                Switch between Obsidian Dark (Amoled contrast) and Studio Light (Precision engineering)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle size="md" />
              <div className="flex items-center bg-black/50 p-1 rounded-lg border border-white/[0.06] gap-1">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-all ${
                    theme === "dark" ? "bg-sky-500/20 text-sky-300 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Obsidian Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-all ${
                    theme === "light" ? "bg-amber-500/20 text-amber-500 font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Studio Light</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-slate-300">Unit System</span>
            <div className="flex items-center bg-black/50 p-1 rounded-lg border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setUnitSystem("metric")}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  unitSystem === "metric" ? "bg-sky-500/20 text-sky-300 font-semibold" : "text-slate-400"
                }`}
              >
                Metric (km, Wh/km, °C)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem("imperial")}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  unitSystem === "imperial" ? "bg-sky-500/20 text-sky-300 font-semibold" : "text-slate-400"
                }`}
              >
                Imperial (mi, Wh/mi, °F)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <span className="text-slate-300">CAN Telemetry Sampling Rate</span>
            <select
              value={samplingRate}
              onChange={(e) => setSamplingRate(e.target.value as any)}
              className="bg-black/60 text-white border border-white/[0.08] rounded-lg px-2.5 py-1"
            >
              <option value="100">100 Hz (Real-Time CAN)</option>
              <option value="50">50 Hz (High Fidelity)</option>
              <option value="10">10 Hz (Low Bandwidth)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
