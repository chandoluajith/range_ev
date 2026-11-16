export interface ModelEvaluationMetrics {
  maeWhKm: number; // 6.8 Wh/km
  rmseWhKm: number; // 9.4 Wh/km
  mapePercent: number; // 4.7%
  r2Score: number; // 0.93
  ci95WhKm: number; // ±8 km or ±0.4 Wh/km
  sampleCount: number; // 1,200 observation epochs
  crossValidationFolds: number; // k=5
  kernelLatencyMs: number; // 18ms
  lastCalibrated: string;
}

export interface ScatterResidualPoint {
  id: string;
  actualWhKm: number;
  predictedWhKm: number;
  residual: number; // actual - predicted
  speedKmh: number;
  gradePercent: number;
  category: "optimal" | "high_drag" | "regen";
}

export interface ModelAblationComparison {
  id: string;
  architecture: string;
  type: "Physics Baseline" | "Pure Deep ML (LSTM)" | "Physics-Informed Hybrid (PINN)";
  maeWhKm: number;
  rmseWhKm: number;
  mapePercent: number;
  r2Score: number;
  inferenceLatencyMs: number;
  extrapolationStability: "High" | "Moderate" | "Low";
  status: "active" | "benchmark";
}

export interface FeatureImportanceItem {
  name: string;
  category: "Aerodynamics" | "Kinematics" | "Topography" | "Thermals" | "Auxiliary";
  importanceScore: number; // 0 - 100
  shapValueMean: number;
  description: string;
}

export interface TrainingLossEpoch {
  epoch: number;
  totalLoss: number;
  physicsResidualLoss: number;
  dataFitLoss: number;
}
