"use client";

import { useState, useCallback, useMemo } from "react";
import { VehicleProfile, VehicleState } from "@/types/vehicle";
import { DEFAULT_VEHICLES } from "@/lib/constants";
import { initialVehicleState } from "@/data/mockVehicle";

export function useVehicle() {
  const [vehicles, setVehicles] = useState<VehicleProfile[]>(DEFAULT_VEHICLES);
  const [vehicleState, setVehicleState] = useState<VehicleState>(initialVehicleState);

  const currentVehicle = useMemo(() => {
    return (
      vehicles.find((v) => v.id === vehicleState.currentVehicleId) ||
      vehicles[0]
    );
  }, [vehicles, vehicleState.currentVehicleId]);

  const selectVehicle = useCallback((id: string) => {
    setVehicleState((prev) => ({
      ...prev,
      currentVehicleId: id,
    }));
  }, []);

  const toggleSimulationMode = useCallback(() => {
    setVehicleState((prev) => ({
      ...prev,
      simulationMode: !prev.simulationMode,
    }));
  }, []);

  const updatePhysicsParams = useCallback(
    (params: Partial<VehicleProfile>) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleState.currentVehicleId ? { ...v, ...params } : v
        )
      );
    },
    [vehicleState.currentVehicleId]
  );

  const resetToNominal = useCallback(() => {
    setVehicles(DEFAULT_VEHICLES);
  }, []);

  return {
    vehicles,
    currentVehicle,
    vehicleState,
    selectVehicle,
    toggleSimulationMode,
    updatePhysicsParams,
    resetToNominal,
  };
}
