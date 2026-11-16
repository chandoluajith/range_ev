import { VehicleProfile, VehicleState } from "@/types/vehicle";
import { DEFAULT_VEHICLES } from "@/lib/constants";

export const activeVehicle: VehicleProfile = DEFAULT_VEHICLES[0]; // Porsche Taycan GTS

export const initialVehicleState: VehicleState = {
  currentVehicleId: activeVehicle.id,
  connectionState: "connected",
  canBusSyncRateHz: 100,
  datasetStatus: "RT-SYNCED",
  activeTripId: "TR-842",
  simulationMode: true,
};
