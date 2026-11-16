"use client";

import React from "react";
import { Cpu, CheckCircle2, TrendingDown, Layers, BarChart2, Zap } from "lucide-react";
import { Metric } from "@/components/ui/Metric";
import { Badge } from "@/components/ui/Badge";
import { LineChart } from "@/components/charts/LineChart";
import {
  mockModelMetrics,
  mockAblationComparisons,
  mockScatterPoints,
  mockFeatureImportances,
  mockTrainingLossEpochs,
} from "@/data/mockModel";

export default function ModelPerformancePage() {
  const metrics = mockModelMetrics;

  const lossLabels = mockTrainingLossEpochs.map((e) => `Epoch ${e.epoch}`);
  const totalLoss = mockTrainingLossEpochs.map((e) => e.totalLoss * 1000);
  const physicsLoss = mockTrainingLossEpochs.map((e) => e.physicsResidualLoss * 1000);
  const dataLoss = mockTrainingLossEpochs.map((e) => e.dataFitLoss * 1000);

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight font-sans">
              Model Performance &amp; Physics-ML Validation
            </h1>
            <Badge variant="primary" size="md">
              PINN + GBR Architecture
            </Badge>
          </div>
          <p className="text-[13px] text-slate-400 font-sans mt-0.5">
            Scientific evaluation, cross-validation metrics, ablation comparisons, and residual distribution
          </p>
        </div>

        <span className="text-[11px] font-mono text-slate-400 self-start">
          Calibrated: 18ms Kernel Latency · k=5 Folds
        </span>
      </div>

      {/* Primary 4 Validation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Metric
          label="Mean Absolute Error (MAE)"
          value={metrics.maeWhKm}
          unit="Wh/km"
          icon={<Cpu className="w-4 h-4 text-emerald-400" />}
          comparison="±0.4 Wh/km (95% CI)"
          status="Optimal Convergence"
          statusType="optimal"
        />

        <Metric
          label="Root Mean Squared Error"
          value={metrics.rmseWhKm}
          unit="Wh/km"
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          comparison="Low Outlier Penalty"
          status="Tight Residue"
          statusType="optimal"
        />

        <Metric
          label="Range Deviation (MAPE)"
          value={`${metrics.mapePercent}%`}
          icon={<TrendingDown className="w-4 h-4 text-sky-400" />}
          comparison="vs EPA standard 12%"
          status="High Accuracy"
          statusType="optimal"
        />

        <Metric
          label="Coefficient of Determination (R²)"
          value={metrics.r2Score}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          comparison="Physics-Informed Hybrid"
          status="93% Variance Explained"
          statusType="optimal"
        />
      </div>

      {/* Actual vs Predicted Scatter Chart & Residual Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Scatter Plot */}
        <div className="lg:col-span-7 rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-white font-sans">
                Actual CAN Consumption vs Predicted PINN
              </h3>
              <p className="text-[12px] text-slate-400 font-sans mt-0.5">
                Evaluation across 1,200 observation epochs (Wh/km)
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              R² = 0.9304
            </span>
          </div>

          <div className="relative w-full h-72 my-2 bg-black/40 border border-white/[0.04] rounded-xl p-3 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 300 180">
              {/* Reference Grid */}
              <line x1="40" y1="150" x2="280" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {/* 45-degree Perfect Identity Line */}
              <line
                x1="40"
                y1="150"
                x2="280"
                y2="20"
                stroke="#64748b"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.45"
              />

              {/* Scatter Points */}
              {mockScatterPoints.map((pt) => {
                const x = 40 + ((pt.actualWhKm - 70) / 190) * 240;
                const y = 150 - ((pt.predictedWhKm - 70) / 190) * 130;
                const isOptimal = Math.abs(pt.residual) <= 2;
                return (
                  <circle
                    key={pt.id}
                    cx={x}
                    cy={y}
                    r={isOptimal ? 3.5 : 2.8}
                    fill={isOptimal ? "#10b981" : "#38bdf8"}
                    stroke="#08090c"
                    strokeWidth="1"
                    opacity={0.9}
                  />
                );
              })}

              <text x="280" y="165" textAnchor="end" className="text-[9px] font-mono fill-slate-500">
                Actual CAN (Wh/km)
              </text>
              <text x="35" y="15" textAnchor="start" className="text-[9px] font-mono fill-slate-500">
                Predicted (Wh/km)
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/[0.04] pt-2">
            <span>● Emerald: Zero-deviation cluster (|e| ≤ 2 Wh/km)</span>
            <span>● Cyan: High dynamic boundary</span>
          </div>
        </div>

        {/* PINN Multi-Task Loss Convergence Curve */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-[16px] font-semibold text-white font-sans">
              Training Loss Decomposition
            </h3>
            <p className="text-[12px] text-slate-400 font-sans mt-0.5">
              Joint loss function: L = L_data + λ · L_physics
            </p>
          </div>

          <div className="my-2">
            <LineChart
              height={190}
              labels={lossLabels}
              minY={0}
              maxY={90}
              unit="x10⁻³"
              series={[
                { id: "total", name: "Total Loss", color: "#38bdf8", data: totalLoss },
                { id: "physics", name: "Physics Residual", color: "#94a3b8", dashed: true, data: physicsLoss },
                { id: "data", name: "Empirical Fit", color: "#10b981", data: dataLoss },
              ]}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/[0.04] pt-2">
            <span className="text-sky-400">Total Loss: 0.012</span>
            <span className="text-emerald-400">Stable minimum achieved</span>
          </div>
        </div>
      </div>

      {/* Model Ablation Benchmark Table */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white font-sans">
            Architecture Ablation Comparison
          </h3>
          <p className="text-[12px] text-slate-400 font-sans mt-0.5">
            Systematic benchmark proving why physics-informed ML outperforms both purely physical and purely black-box ML models
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[12px] border-collapse min-w-[700px]">
            <thead>
              <tr className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
                <th className="py-3 px-3">Architecture Approach</th>
                <th className="py-3 px-3">MAE (Wh/km)</th>
                <th className="py-3 px-3">RMSE (Wh/km)</th>
                <th className="py-3 px-3">MAPE %</th>
                <th className="py-3 px-3">R² Score</th>
                <th className="py-3 px-3">Latency</th>
                <th className="py-3 px-3 text-right">Extrapolation Stability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {mockAblationComparisons.map((row) => {
                const isActive = row.status === "active";
                return (
                  <tr
                    key={row.id}
                    className={isActive ? "bg-sky-500/[0.06] text-white" : "hover:bg-white/[0.02]"}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                        )}
                        <span className="font-sans font-medium text-[13px]">{row.architecture}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-3 font-semibold ${isActive ? "text-emerald-400" : ""}`}>
                      {row.maeWhKm}
                    </td>
                    <td className="py-3 px-3">{row.rmseWhKm}</td>
                    <td className="py-3 px-3">{row.mapePercent}%</td>
                    <td className={`py-3 px-3 font-semibold ${isActive ? "text-emerald-400" : ""}`}>
                      {row.r2Score}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{row.inferenceLatencyMs} ms</td>
                    <td className="py-3 px-3 text-right">
                      <Badge
                        variant={
                          row.extrapolationStability === "High"
                            ? "success"
                            : row.extrapolationStability === "Moderate"
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {row.extrapolationStability}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance SHAP Ranking */}
      <div className="rounded-2xl glass-panel p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-[16px] font-semibold text-white font-sans">
            Global Feature Importance &amp; Physics Attribution
          </h3>
          <p className="text-[12px] text-slate-400 font-sans mt-0.5">
            Mean absolute SHAP value (|SHAP|) across kinematic, topographic, and thermal sensor channels
          </p>
        </div>

        <div className="flex flex-col gap-3 font-mono">
          {mockFeatureImportances.map((item) => (
            <div key={item.name} className="flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 font-mono">
                    {item.category}
                  </span>
                  <span className="text-white font-sans font-medium">{item.name}</span>
                </div>
                <span className="text-sky-400 font-semibold">{item.importanceScore} / 100</span>
              </div>

              <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-sky-500 to-sky-400 h-full rounded-full"
                  style={{ width: `${item.importanceScore}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
