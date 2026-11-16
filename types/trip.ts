export interface TripSummary {
  id: string;
  code: string; // e.g. "TR-842"
  routeName: string;
  startLocation: string;
  endLocation: string;
  timestamp: string;
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
  rangeErrorPercent: number; // e.g. +2.0%
  drivingStyle: "ECO" | "MODERATE" | "AGGRESSIVE" | "DYNAMIC";
  status: "Verified" | "Validated" | "Simulated" | "Flagged";
  vehicleName: string;
  ambientTempC: number;
  hvacEnergyKWh: number;
}

export interface TripDetail extends TripSummary {
  telemetrySliceSummary: {
    rollingResistanceKWh: number;
    aeroDragKWh: number;
    gravitationalNetKWh: number;
    powertrainLossKWh: number;
    auxHVACKWh: number;
    regeneratedKWh: number;
  };
  elevationProfile: {
    km: number;
    elevationM: number;
    gradientPercent: number;
    consumptionWhKm: number;
  }[];
  speedDistribution: {
    range: string;
    percentage: number;
  }[];
}
