import {
  TelemetryPoint,
  RangePrediction,
  DrivingBehaviorMetrics,
  ExplainabilityFactor,
  CanMessageFrame,
} from "@/types/telemetry";

export const currentRangePrediction: RangePrediction = {
  physicsRange: 154,
  mlAdjustedRange: 148,
  personalizedRange: 148,
  confidence: 8,
  confidencePercent: 95,
  updatedAt: "12 seconds ago",
  deltaVsNominal: 7,
  baselineEPA: 160,
  lowerCiKm: 140,
  upperCiKm: 156,
  targetHorizon: "Munich Terminal",
  convergenceRate: 99.4,
};

export const currentLiveMetrics = {
  speed: 57,
  speedTarget: 60,
  speedState: "Optimal Drag",
  batteryPower: 18.4,
  peakPowerLimitKW: 260,
  powerPercentPeak: 7.1,
  voltage: 358.2,
  nominalVoltage: 360,
  voltageDelta: -1.8,
  current: 51.4,
  currentMode: "Discharge Mode",
  busStatus: "DC Bus Sync",
  batteryTemperature: 31.0,
  tempWindowMin: 25,
  tempWindowMax: 35,
  tempZone: "Optimal Zone",
  roadGradient: 2.4,
  gradeType: "Alpine Ascent",
  inverterTempC: 38.4,
  motorRpm: 4620,
  regenPowerKW: 0.0,
  auxHvacPowerKW: 1.2,
  cabinTempC: 21.0,
  socPercent: 64.2,
  usableEnergyRemainingKWh: 59.8,
  currentWhKm: 151,
};

export const drivingBehaviorData: DrivingBehaviorMetrics = {
  classification: "MODERATE",
  subtitle: "Highway Profile · Clustered via 3-axis IMU",
  accelerationAggression: 48,
  accelerationLabel: "Moderate",
  brakingConsistency: 82,
  brakingLabel: "Smooth",
  speedVariation: 24,
  speedVariationLabel: "Low",
  efficiencyTrendPercent: 3.2,
  clusterId: "Cluster #3B",
  hardAccelerationEvents: 1,
  hardBrakingEvents: 0,
  stopStartFrequency: 1.8,
  regenRecaptureRate: 84.2,
  corneringStabilityScore: 91,
  recentEfficiencySeries: [
    { time: "14:00", value: 142 },
    { time: "14:08", value: 158 },
    { time: "14:15", value: 164 },
    { time: "14:22", value: 155 },
    { time: "14:28", value: 152 },
    { time: "14:32", value: 151 },
  ],
};

export const explainabilityFactors: ExplainabilityFactor[] = [
  {
    id: "speed",
    name: "High average speed",
    detail: "Sustained highway cruise velocity (95-120 km/h aero drag curve)",
    impactKm: -8,
    direction: "drain",
    relativeMagnitude: 55,
    category: "speed",
  },
  {
    id: "grade",
    name: "Uphill gradient",
    detail: "Topographic elevation climb (+2.4% avg incline on alpine stretch)",
    impactKm: -6,
    direction: "drain",
    relativeMagnitude: 42,
    category: "elevation",
  },
  {
    id: "throttle",
    name: "Frequent acceleration",
    detail: "Dynamic throttle punchiness and intermittent overtake maneuvers",
    impactKm: -5,
    direction: "drain",
    relativeMagnitude: 35,
    category: "dynamics",
  },
  {
    id: "regen",
    name: "Regenerative braking",
    detail: "Predictive deceleration energy recapture on gentle descents",
    impactKm: 3,
    direction: "recapture",
    relativeMagnitude: 25,
    category: "regen",
  },
  {
    id: "efficiency",
    name: "Recent efficient driving",
    detail: "Kinematic stabilization over past 15 min cruise envelope",
    impactKm: 4,
    direction: "recapture",
    relativeMagnitude: 32,
    category: "efficiency",
  },
];

export const currentTripSummaryData = {
  distanceKm: 42.8,
  energyUsedKWh: 6.7,
  avgConsumptionWhKm: 156,
  avgSpeedKmh: 49,
  elevationGainM: 183,
  regenEnergyKWh: 0.8,
  regenRatePercent: 11.9,
  tripActiveDuration: "52m 14s",
  routeTitle: "Innsbruck Alpine Base → A12 Autobahn → Munich South",
  startElevationM: 410,
  currentElevationM: 593,
  climbBars: [30, 35, 40, 45, 55, 60, 68, 75, 88, 98],
};

// Generates continuous realistic telemetry time series for various time windows
export function generateTimeSeries(pointsCount: number, windowLabel: string): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const baseSoc = 68.5;
  const socStep = (68.5 - 64.2) / pointsCount;
  
  // Starting timestamp 14:00:00
  const startMinute = windowLabel === "5 min" ? 27 : windowLabel === "15 min" ? 17 : windowLabel === "30 min" ? 2 : 0;

  for (let i = 0; i <= pointsCount; i++) {
    const fraction = i / pointsCount;
    const minute = (startMinute + Math.floor(fraction * 32)) % 60;
    const second = Math.floor((fraction * 1920) % 60);
    const timestamp = `14:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    // Realistic physics curve with speed and elevation oscillation
    const baseSpeed = 54 + Math.sin(fraction * 8) * 12 + Math.cos(fraction * 14) * 5;
    const grade = 1.2 + Math.sin(fraction * 6) * 2.2;
    const aeroDragPower = 0.5 * 1.225 * 0.22 * 2.33 * Math.pow((baseSpeed * 1000) / 3600, 3) / 1000;
    const rollingPower = (2310 * 9.81 * 0.0095 * ((baseSpeed * 1000) / 3600)) / 1000;
    const gravityPower = (2310 * 9.81 * (grade / 100) * ((baseSpeed * 1000) / 3600)) / 1000;
    const aux = 1.2;

    const physicsPower = Math.max(0, aeroDragPower + rollingPower + gravityPower + aux);
    const actualPower = physicsPower * (1 + (Math.sin(fraction * 20) * 0.08) - (i % 7 === 0 ? 0.04 : 0));
    const regenPower = actualPower < 0 ? Math.abs(actualPower) : (i % 11 === 0 ? 6.5 : 0);

    const actualWhKm = Math.round(144 + Math.sin(fraction * 7) * 22 + grade * 6.5);
    const physicsWhKm = Math.round(152 + Math.sin(fraction * 7) * 18 + grade * 5.8);
    const mlAdjustedWhKm = Math.round(actualWhKm * 0.98 + (i % 2 === 0 ? 1 : -1));

    const voltage = 360 - (fraction * 1.8) - (actualPower / 260) * 4.5;
    const current = Math.round(((actualPower * 1000) / voltage) * 10) / 10;
    const soc = Math.round((baseSoc - i * socStep) * 10) / 10;
    const temp = Math.round((29.8 + fraction * 1.4 + (actualPower > 25 ? 0.3 : 0)) * 10) / 10;

    points.push({
      timestamp,
      timeSec: i * 30,
      speed: Math.round(baseSpeed * 10) / 10,
      acceleration: Math.round(Math.sin(fraction * 15) * 0.9 * 100) / 100,
      soc,
      voltage: Math.round(voltage * 10) / 10,
      current,
      batteryTemperature: temp,
      roadGradient: Math.round(grade * 10) / 10,
      elevation: Math.round(410 + fraction * 183),
      motorPower: Math.round(actualPower * 10) / 10,
      regenPower: Math.round(regenPower * 10) / 10,
      auxPower: aux,
      distance: Math.round(fraction * 42.8 * 10) / 10,
      actualWhKm,
      physicsWhKm,
      mlAdjustedWhKm,
      ambientTemp: 19.5,
    });
  }

  return points;
}

export const tripTimeSeries5Min = generateTimeSeries(16, "5 min");
export const tripTimeSeries15Min = generateTimeSeries(24, "15 min");
export const tripTimeSeries30Min = generateTimeSeries(32, "30 min");
export const tripTimeSeriesFull = generateTimeSeries(42, "Trip");

export const simulatedCanBusFrames: CanMessageFrame[] = [
  { id: "can-1", canId: "0x180", sourceNode: "INV_FRONT", dlc: 8, dataHex: "1F 84 00 C2 44 10 9A 00", signalName: "FRONT_INVERTER_TORQUE", physicalValue: 248.5, unit: "Nm", frequencyHz: 100 },
  { id: "can-2", canId: "0x182", sourceNode: "INV_REAR", dlc: 8, dataHex: "3A 9B 01 D4 88 12 B1 00", signalName: "REAR_INVERTER_TORQUE", physicalValue: 382.0, unit: "Nm", frequencyHz: 100 },
  { id: "can-3", canId: "0x240", sourceNode: "BMS_MASTER", dlc: 8, dataHex: "01 66 0E 12 1F C4 20 01", signalName: "PACK_VOLTAGE_MAIN", physicalValue: 358.2, unit: "V", frequencyHz: 50 },
  { id: "can-4", canId: "0x250", sourceNode: "BMS_CURRENT", dlc: 6, dataHex: "02 02 00 33 0A 11", signalName: "PACK_DISCHARGE_CURRENT", physicalValue: 51.4, unit: "A", frequencyHz: 100 },
  { id: "can-5", canId: "0x310", sourceNode: "BMS_THERMAL", dlc: 8, dataHex: "1F 1F 20 1E 21 20 1F 1F", signalName: "CELL_TEMP_MEAN", physicalValue: 31.0, unit: "°C", frequencyHz: 10 },
  { id: "can-6", canId: "0x312", sourceNode: "BMS_THERMAL", dlc: 8, dataHex: "00 06 00 03 00 01 00 02", signalName: "CELL_TEMP_MAX_SPREAD", physicalValue: 1.2, unit: "Δ°C", frequencyHz: 10 },
  { id: "can-7", canId: "0x480", sourceNode: "GPS_IMU_FUSION", dlc: 8, dataHex: "00 18 01 4C 04 22 10 99", signalName: "ROAD_GRADE_PERCENT", physicalValue: 2.4, unit: "%", frequencyHz: 20 },
  { id: "can-8", canId: "0x510", sourceNode: "AERO_BODY", dlc: 4, dataHex: "02 11 00 00", signalName: "ACTIVE_SPOILER_DEPLOY", physicalValue: "ECO_STAGE_1", unit: "deg", frequencyHz: 10 },
];
