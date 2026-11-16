export interface VehicleProfile {
  id: string;
  name: string;
  model: string;
  trim: string;
  vin: string;
  batteryCapacityKWh: number;
  usableCapacityKWh: number;
  nominalVoltage: number;
  curbWeightKg: number;
  dragCoefficientCd: number;
  frontalAreaM2: number;
  rollingResistanceCrr: number;
  drivetrainEfficiency: number;
  maxMotorPowerKW: number;
  maxRegenPowerKW: number;
  eparangeKm: number;
}

export interface VehicleState {
  currentVehicleId: string;
  connectionState: "connected" | "syncing" | "offline";
  canBusSyncRateHz: number;
  datasetStatus: "RT-SYNCED" | "BUFFERING" | "STANDBY";
  activeTripId: string;
  simulationMode: boolean;
}
