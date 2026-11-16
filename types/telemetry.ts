export interface TelemetryPoint {
  timestamp: string;
  timeSec: number;
  speed: number; // km/h
  acceleration: number; // m/s^2
  soc: number; // % (0-100)
  voltage: number; // V
  current: number; // A (positive: discharge, negative: charge/regen)
  batteryTemperature: number; // °C
  roadGradient: number; // % grade (-10% to +15%)
  elevation: number; // meters
  motorPower: number; // kW
  regenPower: number; // kW
  auxPower: number; // kW (HVAC, computer, pumps)
  distance: number; // km from start
  actualWhKm: number; // Wh/km CAN measurement
  physicsWhKm: number; // Wh/km Physics model calculation
  mlAdjustedWhKm: number; // Wh/km PINN hybrid output
  ambientTemp: number; // °C
}

export interface RangePrediction {
  physicsRange: number; // km
  mlAdjustedRange: number; // km
  personalizedRange: number; // km
  confidence: number; // ± km (e.g. 8)
  confidencePercent: number; // e.g. 95%
  updatedAt: string; // ISO or relative
  deltaVsNominal: number; // e.g. +7 km
  baselineEPA: number; // e.g. 160 km
  lowerCiKm: number; // e.g. 140 km
  upperCiKm: number; // e.g. 156 km
  targetHorizon: string; // "Munich Terminal"
  convergenceRate: number; // e.g. 99.4%
}

export type DrivingStyleCategory = "ECO" | "MODERATE" | "AGGRESSIVE" | "DYNAMIC";

export interface DrivingBehaviorMetrics {
  classification: DrivingStyleCategory;
  subtitle: string;
  accelerationAggression: number; // 0-100
  accelerationLabel: "Gentle" | "Moderate" | "Aggressive";
  brakingConsistency: number; // 0-100
  brakingLabel: "Smooth" | "Gradual" | "Abrupt";
  speedVariation: number; // 0-100
  speedVariationLabel: "Low" | "Moderate" | "High";
  efficiencyTrendPercent: number; // e.g. +3.2%
  clusterId: string; // e.g. "Cluster #3B"
  hardAccelerationEvents: number;
  hardBrakingEvents: number;
  stopStartFrequency: number; // stops per 10km
  regenRecaptureRate: number; // e.g. 84%
  corneringStabilityScore: number; // 0-100
  recentEfficiencySeries: { time: string; value: number }[];
}

export interface ExplainabilityFactor {
  id: string;
  name: string;
  detail: string;
  impactKm: number; // e.g. -8 or +4
  direction: "drain" | "recapture";
  relativeMagnitude: number; // 0 - 100% for progress visual
  category: "speed" | "elevation" | "dynamics" | "regen" | "efficiency";
}

export interface CanMessageFrame {
  id: string;
  canId: string;
  sourceNode: string;
  dlc: number;
  dataHex: string;
  signalName: string;
  physicalValue: number | string;
  unit: string;
  frequencyHz: number;
}
