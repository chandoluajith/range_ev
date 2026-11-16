"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TelemetryPoint, CanMessageFrame } from "@/types/telemetry";
import {
  currentLiveMetrics,
  tripTimeSeries5Min,
  tripTimeSeries15Min,
  tripTimeSeries30Min,
  tripTimeSeriesFull,
  simulatedCanBusFrames,
} from "@/data/mockTelemetry";

export type DrivingScenario = "Alpine Ascent" | "Highway Cruise" | "Urban Stop & Go" | "Downhill Regen";

export function useTelemetry() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeWindow, setTimeWindow] = useState<"5 min" | "15 min" | "30 min" | "Trip">("Trip");
  const [scenario, setScenario] = useState<DrivingScenario>("Alpine Ascent");
  const [metrics, setMetrics] = useState(currentLiveMetrics);
  const [canFrames, setCanFrames] = useState<CanMessageFrame[]>(simulatedCanBusFrames);
  const [updateCount, setUpdateCount] = useState<number>(0);

  // Switch time series dataset based on toggle
  const activeTimeSeries: TelemetryPoint[] = useMemo(() => {
    switch (timeWindow) {
      case "5 min":
        return tripTimeSeries5Min;
      case "15 min":
        return tripTimeSeries15Min;
      case "30 min":
        return tripTimeSeries30Min;
      case "Trip":
      default:
        return tripTimeSeriesFull;
    }
  }, [timeWindow]);

  // Subtle live simulated micro-variations to give an authentic automotive HUD feel
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setUpdateCount((c) => c + 1);
      setMetrics((prev) => {
        // Subtle drift based on selected scenario
        let speed = prev.speed;
        let batteryPower = prev.batteryPower;
        let grade = prev.roadGradient;
        let current = prev.current;
        let regen = 0;

        if (scenario === "Alpine Ascent") {
          speed = 57 + (Math.sin(Date.now() / 1500) * 2.2);
          batteryPower = 18.4 + (Math.sin(Date.now() / 2000) * 1.8);
          grade = 2.4 + (Math.cos(Date.now() / 3000) * 0.3);
        } else if (scenario === "Highway Cruise") {
          speed = 118 + (Math.sin(Date.now() / 1800) * 3.5);
          batteryPower = 28.5 + (Math.sin(Date.now() / 1800) * 2.1);
          grade = 0.4 + (Math.cos(Date.now() / 4000) * 0.2);
        } else if (scenario === "Urban Stop & Go") {
          speed = Math.max(0, 34 + (Math.sin(Date.now() / 1200) * 18));
          batteryPower = speed < 10 ? -4.5 : 12.0 + (Math.sin(Date.now() / 1500) * 6);
          grade = 0.1;
          regen = batteryPower < 0 ? Math.abs(batteryPower) : 0;
        } else if (scenario === "Downhill Regen") {
          speed = 64 + (Math.sin(Date.now() / 2500) * 2.0);
          batteryPower = -14.2 + (Math.sin(Date.now() / 2000) * 3.5);
          grade = -3.8;
          regen = Math.abs(batteryPower);
        }

        const voltage = 358.2 - (batteryPower / 260) * 3.5;
        current = Math.round(((batteryPower * 1000) / voltage) * 10) / 10;
        const currentWhKm = Math.max(0, Math.round(151 + (batteryPower - 18.4) * 3.2));

        return {
          ...prev,
          speed: Math.round(speed * 10) / 10,
          batteryPower: Math.round(batteryPower * 10) / 10,
          voltage: Math.round(voltage * 10) / 10,
          current,
          roadGradient: Math.round(grade * 10) / 10,
          regenPowerKW: Math.round(regen * 10) / 10,
          currentWhKm,
        };
      });

      // Update CAN bus payloads
      setCanFrames((prev) =>
        prev.map((f) => {
          if (f.canId === "0x180") {
            const val = Math.round((240 + Math.random() * 15) * 10) / 10;
            return { ...f, physicalValue: val };
          }
          if (f.canId === "0x250") {
            const val = Math.round((48 + Math.random() * 6) * 10) / 10;
            return { ...f, physicalValue: val };
          }
          return f;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, scenario]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  return {
    metrics,
    activeTimeSeries,
    timeWindow,
    setTimeWindow,
    scenario,
    setScenario,
    isPlaying,
    togglePlay,
    canFrames,
    updateCount,
  };
}
