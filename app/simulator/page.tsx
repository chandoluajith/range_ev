"use client";

import React, { useState } from "react";
import { Car, ExternalLink, Maximize2, RotateCcw, Cpu, Zap, Wind, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SimulatorPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
              3D Digital Twin &amp; Telemetry Simulator
            </h1>
            <Badge variant="primary" size="md">
              Three.js WebGL · 60 FPS
            </Badge>
          </div>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Interactive 3D vehicle physics twin connected to RangeIQ fleet profiles and VED feature inputs
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            variant="glass"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{isFullscreen ? "Standard View" : "Expand View"}</span>
          </Button>

          <a
            href="/simulator3d.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Standalone</span>
          </a>
        </div>
      </div>

      {/* 3D WebGL Viewport Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden glass-panel border border-sky-500/30 shadow-2xl transition-all duration-300 ${
          isFullscreen ? "h-[85vh]" : "h-[620px] sm:h-[680px] lg:h-[740px]"
        }`}
      >
        <iframe
          src="/simulator3d.html"
          title="RangeIQ 3D Digital Twin & Telemetry Simulator"
          className="w-full h-full border-0 block"
          loading="eager"
        />
      </div>

      {/* Feature & Technical Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sky-400">
            <Zap className="w-4 h-4" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">
              800V Skateboard Chassis
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch between Obsidian Metallic fastback body and the X-Ray cutaway revealing 16 illuminated prismatic cell modules, dual PMSM motors, and high-voltage busbars.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-cyan-400">
            <Wind className="w-4 h-4" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">
              Aero Drag Velocity (v²/v³)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Laminar airflow streamlines dynamically scale velocity pulses and aerodynamic retarding force ($F_d = \frac{1}{2}\rho C_d A v^2$) as vehicle speed increases.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-orange-400">
            <RotateCcw className="w-4 h-4" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">
              Ceramic Rotor Regen Glow
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Decoupled 21" turbine wheels spin at 60 FPS while ceramic rotors dissipate kinetic energy, glowing fiery orange-red behind stationary acid-green calipers under regen.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/[0.06] flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Thermometer className="w-4 h-4" />
            <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-white">
              VED Temperature Coupling
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reflecting our VED discovery (Ambient Temp at 46.7% importance), roadside verges automatically morph between lush Summer grass and frozen Winter snow &amp; frost.
          </p>
        </div>
      </div>
    </div>
  );
}
