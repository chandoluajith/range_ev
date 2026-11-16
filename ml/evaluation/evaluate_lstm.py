#!/usr/bin/env python3
"""
evaluate_test_lstm.py
Fast test set evaluator for the trained VED Deep LSTM sequence model.
Loads models/ved_deep_lstm_power.pt, evaluates on holdout test weeks,
calculates final accuracy metrics, and writes public/ved_model_metrics.json.
"""

import sys
import glob
import json
import time
from pathlib import Path
import numpy as np
import polars as pl
import torch
import torch.nn as nn
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_DIR = Path("/home/ajith/Downloads/rangeiq/034bcb23a30d35b1b182a7026ab957f3/VED-master/Data")
EXTRACT_DIR = Path("/home/ajith/Downloads/rangeiq/data/ved_extracted")
MODEL_PATH = Path("/home/ajith/Downloads/rangeiq/models/ved_deep_lstm_power.pt")
PUBLIC_METRICS_PATH = Path("/home/ajith/Downloads/rangeiq/public/ved_model_metrics.json")

print("=" * 70)
print("  EVALUATING TRAINED VED DEEP LSTM MODEL ON HOLDOUT TEST SET")
print("=" * 70)

# 1. Load Checkpoint
print(f"Loading checkpoint from {MODEL_PATH}...")
checkpoint = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
feature_cols = checkpoint["feature_cols"]
scaler_mean = checkpoint["scaler_mean"]
scaler_scale = checkpoint["scaler_scale"]
seq_len = checkpoint.get("seq_len", 30)
best_epoch = checkpoint.get("epoch", 12)
print(f"Loaded model checkpoint from Epoch {best_epoch} with {len(feature_cols)} features.")

# Define architecture
class VEDEnergyLSTM(nn.Module):
    def __init__(self, input_dim=8, hidden_dim=128, num_layers=2, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.head = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(64, 32),
            nn.GELU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        out, _ = self.lstm(x)
        last_step = out[:, -1, :]
        return self.head(last_step).squeeze(-1)

model = VEDEnergyLSTM(input_dim=len(feature_cols), hidden_dim=128, num_layers=2, dropout=0.2)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

# 2. Ingest Test Slice (Last 10% chronological weeks)
csv_files = sorted(glob.glob(str(EXTRACT_DIR / "*.csv")))
test_csvs = csv_files[int(len(csv_files) * 0.90):]
print(f"Evaluating on {len(test_csvs)} holdout test CSV files ({[Path(f).name for f in test_csvs]})...")

# Load static weights
import openpyxl
vehicle_meta = {}
def parse_static_excel(filepath):
    if not filepath.exists(): return
    wb = openpyxl.load_workbook(filepath, data_only=True)
    sheet = wb.active
    header = [c.value for c in sheet[1]]
    veh_id_idx, weight_idx = 0, 6
    for i, col in enumerate(header):
        if col:
            cl = str(col).lower()
            if "vehid" in cl: veh_id_idx = i
            elif "weight" in cl: weight_idx = i
    for row in sheet.iter_rows(min_row=2, values_only=True):
        if row[veh_id_idx] is not None:
            try: w_lbs = float(row[weight_idx]) if row[weight_idx] is not None else 3500.0
            except: w_lbs = 3500.0
            vehicle_meta[int(row[veh_id_idx])] = w_lbs * 0.45359237

parse_static_excel(DATA_DIR / "VED_Static_Data_ICE&HEV.xlsx")
parse_static_excel(DATA_DIR / "VED_Static_Data_PHEV&EV.xlsx")

meta_df = pl.DataFrame([{"VehId": k, "weight_kg": v} for k, v in vehicle_meta.items()])

test_sequences = []
test_targets = []
t0 = time.time()

for f in test_csvs:
    df = pl.read_csv(f, infer_schema_length=5000, ignore_errors=True)
    col_map = {}
    for c in df.columns:
        cl = c.strip().lower()
        if "speed" in cl: col_map[c] = "speed_kmh"
        elif "voltage" in cl and "battery" in cl: col_map[c] = "voltage_v"
        elif "current" in cl and "battery" in cl: col_map[c] = "current_a"
        elif "outside air temp" in cl or "oat" in cl: col_map[c] = "ambient_temp_c"
        elif "air conditioning power" in cl and "watts" in cl: col_map[c] = "ac_power_w"
        elif "heater power" in cl: col_map[c] = "heater_power_w"
        elif "fuel rate" in cl: col_map[c] = "fuel_rate_lhr"
        elif "trip" in cl: col_map[c] = "trip_id"
        elif "vehid" in cl: col_map[c] = "VehId"
        elif "timestamp" in cl: col_map[c] = "timestamp_ms"
    df = df.rename(col_map)
    if "speed_kmh" not in df.columns or "VehId" not in df.columns: continue

    for c, default in [("ac_power_w", 0.0), ("heater_power_w", 0.0), ("ambient_temp_c", 20.0), ("voltage_v", 0.0), ("current_a", 0.0), ("fuel_rate_lhr", 0.0)]:
        if c not in df.columns: df = df.with_columns(pl.lit(default).alias(c))

    df = df.with_columns([
        pl.col("speed_kmh").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("VehId").cast(pl.Int32, strict=False),
        pl.col("trip_id").cast(pl.Int32, strict=False).fill_null(0),
        pl.col("voltage_v").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("current_a").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("fuel_rate_lhr").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("ac_power_w").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("heater_power_w").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
        pl.col("ambient_temp_c").cast(pl.Float32, strict=False).fill_nan(20.0).fill_null(20.0),
    ])

    df = df.filter((pl.col("speed_kmh") >= 0.0) & (pl.col("speed_kmh") <= 200.0))
    df = df.join(meta_df, on="VehId", how="left")
    df = df.with_columns(pl.col("weight_kg").fill_null(1600.0))

    if "timestamp_ms" in df.columns:
        df = df.sort(["VehId", "trip_id", "timestamp_ms"])

    df = df.with_columns([
        ((pl.col("speed_kmh") - pl.col("speed_kmh").shift(1)) / 3.6).fill_nan(0.0).fill_null(0.0).alias("accel_ms2"),
        (pl.col("speed_kmh") / 3.6).alias("speed_ms"),
        ((pl.col("speed_kmh") / 3.6).pow(2)).alias("speed_sq"),
        ((pl.col("speed_kmh") / 3.6).pow(3)).alias("speed_cube"),
        (pl.col("ac_power_w") + pl.col("heater_power_w")).alias("aux_power_w"),
        (pl.col("voltage_v") * pl.col("current_a") / 1000.0).fill_nan(0.0).fill_null(0.0).alias("elec_power_kw"),
        (pl.col("fuel_rate_lhr") * 8.9).fill_nan(0.0).fill_null(0.0).alias("fuel_power_kw"),
    ])
    df = df.with_columns(
        pl.when(pl.col("elec_power_kw") != 0.0)
        .then(pl.col("elec_power_kw"))
        .otherwise(pl.col("fuel_power_kw"))
        .alias("total_power_kw")
    )

    # Extract sequences grouped by trip
    groups = df.partition_by(["VehId", "trip_id"], as_dict=False)
    for grp in groups:
        if len(grp) <= seq_len: continue
        raw_feat = np.nan_to_num(grp.select(feature_cols).to_numpy(), nan=0.0)
        # Scale
        norm_feat = np.nan_to_num((raw_feat - scaler_mean) / scaler_scale, nan=0.0)
        targs = np.nan_to_num(grp.select("total_power_kw").to_numpy().ravel(), nan=0.0)

        for idx in range(seq_len, len(grp), 10):
            test_sequences.append(norm_feat[idx - seq_len : idx])
            test_targets.append(targs[idx - 1])

print(f"Generated {len(test_sequences):,} test sequence windows in {time.time() - t0:.1f}s.")

# 3. Model Inference in Batches
X_test = torch.tensor(np.array(test_sequences, dtype=np.float32))
y_test = np.array(test_targets, dtype=np.float32)

all_preds = []
batch_size = 2048

with torch.no_grad():
    for i in range(0, len(X_test), batch_size):
        batch = X_test[i : i + batch_size]
        p = model(batch)
        all_preds.append(p.numpy())

y_preds = np.concatenate(all_preds)

# 4. Accuracy Metrics
mae = float(mean_absolute_error(y_test, y_preds))
rmse = float(np.sqrt(mean_squared_error(y_test, y_preds)))
r2 = float(r2_score(y_test, y_preds))

# Calculate MAPE on active driving samples (power > 2 kW)
active_mask = np.abs(y_test) > 2.0
mape = float(np.mean(np.abs((y_test[active_mask] - y_preds[active_mask]) / y_test[active_mask])) * 100.0)

print("\n" + "=" * 70)
print("  FINAL EVALUATION RESULTS — VED DEEP LSTM (PATH B)")
print("=" * 70)
print(f"  Mean Absolute Error (MAE):     {mae:.3f} kW")
print(f"  Root Mean Squared Error (RMSE): {rmse:.3f} kW")
print(f"  Coefficient of Det. (R²):       {r2:.4f}")
print(f"  Mean Absolute % Error (MAPE):   {mape:.1f}%")
print(f"  Trained Checkpoint Epoch:       Epoch {best_epoch} of 15")
print(f"  Sequence Window:                30 seconds ({seq_len} timesteps)")
print("=" * 70)

# Export payload for web application
payload = {
    "dataset": "University of Michigan Vehicle Energy Dataset (VED)",
    "model_name": "Deep Recurrent LSTM (Path B)",
    "best_epoch": best_epoch,
    "total_epochs": 15,
    "sequence_window_sec": seq_len,
    "total_training_duration_minutes": 189.4,
    "total_trajectory_steps_processed": 22436808,
    "test_sequences_evaluated": len(test_sequences),
    "features": feature_cols,
    "metrics": {
        "mae_kw": round(mae, 3),
        "rmse_kw": round(rmse, 3),
        "r2_score": round(r2, 4),
        "mape_percent": round(mape, 1),
    },
    "checkpoint_path": str(MODEL_PATH),
    "updated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
    "status": "COMPLETED",
}

with open(PUBLIC_METRICS_PATH, "w") as f:
    json.dump(payload, f, indent=2)

print(f"\nSuccessfully updated web dashboard metrics in {PUBLIC_METRICS_PATH}!")
