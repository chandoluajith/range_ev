# EV Intelligence — Frontend Data Contracts

This document defines the TypeScript interfaces and API response shapes that any future backend (REST, GraphQL, gRPC, or WebSocket) should implement to connect to this frontend without modifying the UI layer.

> **NOTE:** These contracts are strictly frontend definitions. No backend is implemented in this repository.

---

## 1. Real-Time Telemetry Contract

### `TelemetryPoint`
Sent over WebSocket (e.g., `100 Hz` or downsampled to `1 Hz` for visualization) or as a time-series array:

```ts
export interface TelemetryPoint {
  timestamp: string;          // ISO string or "HH:mm:ss"
  timeSec: number;            // Elapsed seconds from start of trip
  speed: number;              // Vehicle ground velocity in km/h
  acceleration: number;       // Longitudinal acceleration in m/s^2
  soc: number;                // Battery State of Charge (0 - 100%)
  voltage: number;            // High-voltage DC bus potential in Volts
  current: number;            // Battery pack current in Amperes (+ discharge, - charge)
  batteryTemperature: number; // Mean cell temperature in °C
  roadGradient: number;       // Road inclination grade in % (-10% to +15%)
  elevation: number;          // Altitude above sea level in meters
  motorPower: number;         // Total active traction power output in kW
  regenPower: number;         // Active regenerative braking recapture power in kW
  auxPower: number;           // Baseline auxiliary draw (HVAC, pumps, ECUs) in kW
  distance: number;           // Cumulative distance in km from trip origin
  actualWhKm: number;         // Measured energy consumption in Wh/km
  physicsWhKm: number;        // First-principles kinematic model estimate in Wh/km
  mlAdjustedWhKm: number;     // Physics-informed neural network output in Wh/km
  ambientTemp: number;        // External ambient temperature in °C
}
```

### `CanMessageFrame`
Raw CAN bus telemetry feed representation (for telemetry monitor views):

```ts
export interface CanMessageFrame {
  id: string;                 // Unique message identifier
  canId: string;              // Hex identifier (e.g. "0x180", "0x240")
  sourceNode: string;         // CAN bus node name (e.g. "INV_FRONT", "BMS_MASTER")
  dlc: number;                // Data length code (number of bytes, typically 8)
  dataHex: string;            // Space-separated hex bytes (e.g. "1F 84 00 C2 44 10 9A 00")
  signalName: string;         // Decoded signal label (e.g. "PACK_VOLTAGE_MAIN")
  physicalValue: number | string; // Engineering unit value
  unit: string;               // Physical unit ("V", "Nm", "A", "°C")
  frequencyHz: number;        // Ingestion broadcast frequency
}
```

---

## 2. Predictive Range Contract

### `RangePrediction`
The primary prediction output calculated by the Physics-Informed Neural Network (PINN):

```ts
export interface RangePrediction {
  physicsRange: number;       // Baseline range from kinematic drag & rolling model (km)
  mlAdjustedRange: number;    // Range adjusted by driver & thermal residual layers (km)
  personalizedRange: number;  // Final synthesized personalized estimate (km)
  confidence: number;         // Confidence interval half-width (± km, e.g. 8)
  confidencePercent: number;  // Confidence level percentage (typically 95%)
  updatedAt: string;          // Human-readable or ISO timestamp of last inference
  deltaVsNominal: number;     // Comparison against catalog nominal range (+7 km)
  baselineEPA: number;        // Nominal EPA/WLTP catalog rating (km)
  lowerCiKm: number;          // Lower 95% bound (km)
  upperCiKm: number;          // Upper 95% bound (km)
  targetHorizon: string;      // Destination waypoint (e.g. "Munich Terminal")
  convergenceRate: number;    // Model mathematical convergence percentage (e.g. 99.4%)
}
```

### `ExplainabilityFactor`
SHAP-derived feature attributions explaining range fluctuations:

```ts
export interface ExplainabilityFactor {
  id: string;                 // Factor identifier ("speed", "grade", "regen")
  name: string;               // Clean descriptive label ("High average speed")
  detail: string;             // Detailed engineering explanation
  impactKm: number;           // Impact on range in kilometers (negative: drain, positive: recapture)
  direction: "drain" | "recapture";
  relativeMagnitude: number;  // 0 - 100% for progress visual width
  category: "speed" | "elevation" | "dynamics" | "regen" | "efficiency";
}
```

---

## 3. Vehicle Profile Contract

```ts
export interface VehicleProfile {
  id: string;                 // Unique slug identifier ("taycan-gts")
  name: string;               // Display model name ("Taycan GTS Sport Turismo")
  model: string;              // Manufacturer model ("Porsche Taycan GTS")
  trim: string;               // Specific package/powertrain trim
  vin: string;                // 17-character Vehicle Identification Number
  batteryCapacityKWh: number; // Gross installed battery capacity in kWh
  usableCapacityKWh: number;  // Net usable capacity in kWh
  nominalVoltage: number;     // System voltage architecture (e.g. 400V or 800V)
  curbWeightKg: number;       // Vehicle curb mass in kg
  dragCoefficientCd: number;  // Aerodynamic drag coefficient Cd
  frontalAreaM2: number;      // Projected frontal cross-sectional area in m²
  rollingResistanceCrr: number; // Tire rolling resistance coefficient Crr
  drivetrainEfficiency: number; // End-to-end mechanical efficiency (0.0 - 1.0)
  maxMotorPowerKW: number;    // Maximum combined motor output in kW
  maxRegenPowerKW: number;    // Maximum regenerative braking absorption in kW
  eparangeKm: number;         // Nominal catalog range in km
}
```

---

## 4. Trip Ledger Contract

```ts
export interface TripSummary {
  id: string;
  code: string;               // Identifier (e.g. "TR-842")
  routeName: string;
  startLocation: string;
  endLocation: string;
  timestamp: string;          // ISO-8601 string
  dateFormatted: string;
  durationMinutes: number;
  durationFormatted: string;
  distanceKm: number;
  energyUsedKWh: number;
  avgConsumptionWhKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  elevationGainM: number;
  startElevationM: number;
  endElevationM: number;
  regenEnergyKWh: number;
  regenRatePercent: number;
  predictedRangeKm: number;
  actualRangeKm: number;
  rangeErrorPercent: number;  // Prediction error percentage
  drivingStyle: "ECO" | "MODERATE" | "AGGRESSIVE" | "DYNAMIC";
  status: "Verified" | "Validated" | "Simulated" | "Flagged";
  vehicleName: string;
}
```

---

## 5. Model Validation & Research Contract

```ts
export interface ModelEvaluationMetrics {
  maeWhKm: number;            // Mean Absolute Error in Wh/km (e.g. 6.8)
  rmseWhKm: number;           // Root Mean Squared Error in Wh/km (e.g. 9.4)
  mapePercent: number;        // Mean Absolute Percentage Error (e.g. 4.7%)
  r2Score: number;            // Coefficient of determination (e.g. 0.93)
  ci95WhKm: number;           // 95% confidence interval threshold
  sampleCount: number;        // Number of validation observation epochs (1,200)
  crossValidationFolds: number; // k-fold count (5)
  kernelLatencyMs: number;    // Single inference latency in ms (18ms)
  lastCalibrated: string;
}
```
