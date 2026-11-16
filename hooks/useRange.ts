"use client";

import { useState, useMemo, useCallback } from "react";
import { RangePrediction, ExplainabilityFactor } from "@/types/telemetry";
import { currentRangePrediction, explainabilityFactors } from "@/data/mockTelemetry";

export interface SensitivityControls {
  ambientTempC: number;
  hvacPowerKW: number;
  driverAggressionMultiplier: number;
  payloadWeightKg: number;
  headwindKmh: number;
}

export function useRange() {
  const [basePrediction] = useState<RangePrediction>(currentRangePrediction);
  const [factors, setFactors] = useState<ExplainabilityFactor[]>(explainabilityFactors);
  
  const [sensitivities, setSensitivities] = useState<SensitivityControls>({
    ambientTempC: 19.5,
    hvacPowerKW: 1.2,
    driverAggressionMultiplier: 1.0,
    payloadWeightKg: 75,
    headwindKmh: 5,
  });

  const updateSensitivity = useCallback(
    <K extends keyof SensitivityControls>(key: K, val: SensitivityControls[K]) => {
      setSensitivities((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const resetSensitivities = useCallback(() => {
    setSensitivities({
      ambientTempC: 19.5,
      hvacPowerKW: 1.2,
      driverAggressionMultiplier: 1.0,
      payloadWeightKg: 75,
      headwindKmh: 5,
    });
  }, []);

  // Compute live responsive range estimation with sensitivity sliders
  const activePrediction = useMemo(() => {
    // Temp penalty: optimal 20C, colder or hotter reduces efficiency
    const tempDelta = Math.abs(sensitivities.ambientTempC - 21.0);
    const tempImpactKm = -(tempDelta * 0.4);

    // HVAC impact: each kW over baseline 1.2 kW burns ~3 km
    const hvacDelta = sensitivities.hvacPowerKW - 1.2;
    const hvacImpactKm = -(hvacDelta * 3.5);

    // Driver aggression impact
    const driverDelta = (sensitivities.driverAggressionMultiplier - 1.0) * 100;
    const driverImpactKm = -(driverDelta * 0.18);

    // Payload impact
    const payloadDelta = sensitivities.payloadWeightKg - 75;
    const payloadImpactKm = -(payloadDelta * 0.02);

    // Headwind
    const windImpactKm = -((sensitivities.headwindKmh - 5) * 0.25);

    const netAdjustment = Math.round(
      tempImpactKm + hvacImpactKm + driverImpactKm + payloadImpactKm + windImpactKm
    );

    const personalized = Math.max(20, basePrediction.personalizedRange + netAdjustment);
    const physics = Math.max(25, basePrediction.physicsRange + Math.round(netAdjustment * 0.8));
    const mlAdjusted = personalized;

    return {
      ...basePrediction,
      physicsRange: physics,
      mlAdjustedRange: mlAdjusted,
      personalizedRange: personalized,
      lowerCiKm: personalized - basePrediction.confidence,
      upperCiKm: personalized + basePrediction.confidence,
      netSensitivityDeltaKm: netAdjustment,
    };
  }, [basePrediction, sensitivities]);

  return {
    prediction: activePrediction,
    factors,
    sensitivities,
    updateSensitivity,
    resetSensitivities,
  };
}
