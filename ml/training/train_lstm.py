#!/usr/bin/env python3
"""
train_ved_deep_lstm.py — PATH B
Deep Sequence Time-Series Model (PyTorch Multi-Layer LSTM) for Vehicle Energy Prediction.
Trains a recurrent sequence model across continuous 30-second driving windows from the VED dataset.
"""

import os
import sys
import glob
import json
import time
import math
from pathlib import Path
import numpy as np

print("=" * 75)
print("  PATH B: DEEP SEQUENCE TIME-SERIES MODEL (PyTorch LSTM)")
print("  Vehicle Energy Dataset (VED) Continuous Temporal Trip Training")
print("=" * 75)

DATA_DIR = Path("/home/ajith/Downloads/rangeiq/034bcb23a30d35b1b182a7026ab957f3/VED-master/Data")
EXTRACT_DIR = Path("/home/ajith/Downloads/rangeiq/data/ved_extracted")
MODEL_OUTPUT_DIR = Path("/home/ajith/Downloads/rangeiq/models")
PUBLIC_METRICS_PATH = Path("/home/ajith/Downloads/rangeiq/public/ved_model_metrics.json")

EXTRACT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------
# STEP 1: EXTRACT ARCHIVES
# ---------------------------------------------------------
csv_files = sorted(glob.glob(str(EXTRACT_DIR / "*.csv")))
if not csv_files:
    print("\n[Step 1/6] Extracting VED 7z archives into", EXTRACT_DIR)
    import py7zr

    part1_path = DATA_DIR / "VED_DynamicData_Part1.7z"
    part2_path = DATA_DIR / "VED_DynamicData_Part2.7z"

    for part_path in [part1_path, part2_path]:
        if part_path.exists():
            print(f" -> Extracting {part_path.name} ({part_path.stat().st_size / (1024*1024):.1f} MB)...")
            t0 = time.time()
            with py7zr.SevenZipFile(part_path, mode="r") as z:
                z.extractall(path=str(EXTRACT_DIR))
            print(f"    Done in {time.time() - t0:.1f}s")

    csv_files = sorted(glob.glob(str(EXTRACT_DIR / "*.csv")))

print(f"\n[Step 1/6] Available CSV files: {len(csv_files)}")
if not csv_files:
    print("[Error] No CSV files found.")
    sys.exit(1)

# ---------------------------------------------------------
# STEP 2: LOAD STATIC METADATA
# ---------------------------------------------------------
print("\n[Step 2/6] Loading vehicle parameters (weights & engine types)...")
import openpyxl

vehicle_meta = {}

def parse_static_excel(filepath, default_type="ICE"):
    if not os.path.exists(filepath):
        return
    wb = openpyxl.load_workbook(filepath, data_only=True)
    sheet = wb.active
    header = [cell.value for cell in sheet[1]]
    
    veh_id_idx = None
    engine_type_idx = None
    weight_idx = None

    for i, col in enumerate(header):
        if col:
            cl = str(col).lower()
            if "vehid" in cl:
                veh_id_idx = i
            elif "enginetype" in cl or "vehicle type" in cl or "engine" in cl:
                engine_type_idx = i
            elif "weight" in cl:
                weight_idx = i

    for row in sheet.iter_rows(min_row=2, values_only=True):
        if veh_id_idx is not None and row[veh_id_idx] is not None:
            veh_id = int(row[veh_id_idx])
            engine_type = str(row[engine_type_idx]) if engine_type_idx is not None and row[engine_type_idx] else default_type
            try:
                weight_lbs = float(row[weight_idx]) if weight_idx is not None and row[weight_idx] is not None else 3500.0
            except (ValueError, TypeError):
                weight_lbs = 3500.0
            weight_kg = weight_lbs * 0.45359237
            vehicle_meta[veh_id] = {
                "engine_type": engine_type,
                "weight_kg": weight_kg,
            }

parse_static_excel(DATA_DIR / "VED_Static_Data_ICE&HEV.xlsx", default_type="ICE")
parse_static_excel(DATA_DIR / "VED_Static_Data_PHEV&EV.xlsx", default_type="EV")
print(f"Loaded metadata for {len(vehicle_meta)} vehicles.")

# ---------------------------------------------------------
# STEP 3: TIME-SERIES INGESTION VIA POLARS
# ---------------------------------------------------------
print("\n[Step 3/6] Ingesting & structuring sequential trip trajectories...")
import polars as pl

meta_rows = [
    {"VehId": k, "weight_kg": v["weight_kg"], "engine_type": v["engine_type"]}
    for k, v in vehicle_meta.items()
]
meta_df = pl.DataFrame(meta_rows)

chunks = []
total_raw_rows = 0
t0 = time.time()

for i, csv_file in enumerate(csv_files):
    try:
        df = pl.read_csv(csv_file, infer_schema_length=10000, ignore_errors=True)
        total_raw_rows += len(df)

        col_map = {}
        for c in df.columns:
            cl = c.strip().lower()
            if "speed" in cl:
                col_map[c] = "speed_kmh"
            elif "voltage" in cl and "battery" in cl:
                col_map[c] = "voltage_v"
            elif "current" in cl and "battery" in cl:
                col_map[c] = "current_a"
            elif "soc" in cl:
                col_map[c] = "soc"
            elif "outside air temp" in cl or "oat" in cl:
                col_map[c] = "ambient_temp_c"
            elif "air conditioning power" in cl and "watts" in cl:
                col_map[c] = "ac_power_w"
            elif "heater power" in cl:
                col_map[c] = "heater_power_w"
            elif "fuel rate" in cl:
                col_map[c] = "fuel_rate_lhr"
            elif "timestamp" in cl:
                col_map[c] = "timestamp_ms"
            elif "daynum" in cl:
                col_map[c] = "day_num"
            elif "trip" in cl:
                col_map[c] = "trip_id"
            elif "vehid" in cl:
                col_map[c] = "VehId"

        df = df.rename(col_map)
        if "speed_kmh" not in df.columns or "VehId" not in df.columns:
            continue

        if "ac_power_w" not in df.columns:
            df = df.with_columns(pl.lit(0.0).alias("ac_power_w"))
        if "heater_power_w" not in df.columns:
            df = df.with_columns(pl.lit(0.0).alias("heater_power_w"))
        if "ambient_temp_c" not in df.columns:
            df = df.with_columns(pl.lit(20.0).alias("ambient_temp_c"))
        if "voltage_v" not in df.columns:
            df = df.with_columns(pl.lit(0.0).alias("voltage_v"))
        if "current_a" not in df.columns:
            df = df.with_columns(pl.lit(0.0).alias("current_a"))
        if "soc" not in df.columns:
            df = df.with_columns(pl.lit(50.0).alias("soc"))

        df = df.with_columns([
            pl.col("speed_kmh").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
            pl.col("VehId").cast(pl.Int32, strict=False),
            pl.col("day_num").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
            pl.col("trip_id").cast(pl.Int32, strict=False).fill_null(0),
            pl.col("voltage_v").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
            pl.col("current_a").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0),
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
            (pl.col("current_a") < 0).cast(pl.Int8).alias("regen_flag"),
            pl.col("soc").cast(pl.Float32, strict=False).fill_nan(50.0).fill_null(50.0).clip(0.0, 100.0).alias("soc_percent"),
        ])

        df = df.with_columns(pl.col("accel_ms2").clip(-8.0, 6.0))

        if "fuel_rate_lhr" in df.columns:
            df = df.with_columns(
                (pl.col("fuel_rate_lhr").cast(pl.Float32, strict=False).fill_nan(0.0).fill_null(0.0) * 8.9).alias("fuel_power_kw")
            )
            df = df.with_columns(
                pl.when(pl.col("engine_type").str.contains("EV|HEV"))
                .then(pl.col("elec_power_kw"))
                .otherwise(pl.col("fuel_power_kw"))
                .fill_nan(0.0)
                .fill_null(0.0)
                .alias("total_power_kw")
            )
        else:
            df = df.with_columns(pl.col("elec_power_kw").fill_nan(0.0).fill_null(0.0).alias("total_power_kw"))

        needed_cols = [
            "VehId", "trip_id", "day_num", "speed_kmh", "speed_ms",
            "accel_ms2", "speed_sq", "speed_cube", "weight_kg",
            "ambient_temp_c", "aux_power_w",
            "regen_flag", "soc_percent",
            "total_power_kw"
        ]
        chunks.append(df.select(needed_cols))
        if (i + 1) % 10 == 0 or (i + 1) == len(csv_files):
            print(f" -> Processed {i+1}/{len(csv_files)} files ({total_raw_rows:,} raw steps)")
    except Exception as e:
        print(f" [Warning] Skipping {csv_file}: {e}")

full_df = pl.concat(chunks)
print(f"Ingested {len(full_df):,} temporal steps in {time.time() - t0:.1f}s.")

# ---------------------------------------------------------
# STEP 4: GENERATE SLIDING TEMPORAL SEQUENCES (30-second windows)
# ---------------------------------------------------------
print("\n[Step 4/6] Constructing temporal sequences (Sequence Window = 30 seconds)...")
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import StandardScaler

feature_cols = [
    "speed_kmh",
    "speed_ms",
    "accel_ms2",
    "speed_sq",
    "speed_cube",
    "weight_kg",
    "ambient_temp_c",
    "aux_power_w",
    "regen_flag",      # NEW: 1=regen braking, 0=traction
    "soc_percent",     # NEW: Battery State of Charge 0-100%
]
target_col = "total_power_kw"

# Filter clean data
full_df = full_df.filter(
    pl.col(target_col).is_not_null() &
    pl.col(target_col).is_not_nan() &
    pl.col("speed_kmh").is_not_null()
)

# Chronological split
min_day = full_df["day_num"].min()
max_day = full_df["day_num"].max()
day_range = max_day - min_day
train_cutoff = min_day + day_range * 0.80
val_cutoff = min_day + day_range * 0.90

train_df = full_df.filter(pl.col("day_num") < train_cutoff)
val_df = full_df.filter((pl.col("day_num") >= train_cutoff) & (pl.col("day_num") < val_cutoff))
test_df = full_df.filter(pl.col("day_num") >= val_cutoff)

# Fit scaler strictly on training data
scaler = StandardScaler()
X_train_raw = np.nan_to_num(train_df.select(feature_cols).to_numpy(), nan=0.0)
scaler.fit(X_train_raw)

SEQ_LEN = 30  # 30-second temporal historical context window

def create_sequences_from_df(df, scaler, seq_len=30, stride=5):
    """
    Constructs sequence windows grouped strictly within each (VehId, trip_id)
    to prevent temporal boundary contamination between distinct trips.
    """
    sequences = []
    targets = []
    
    # Group by trip
    groups = df.partition_by(["VehId", "trip_id"], as_dict=False)
    for grp in groups:
        if len(grp) <= seq_len:
            continue
        raw_feat = np.nan_to_num(grp.select(feature_cols).to_numpy(), nan=0.0)
        feat_vals = np.nan_to_num(scaler.transform(raw_feat), nan=0.0)
        targ_vals = np.nan_to_num(grp.select(target_col).to_numpy().ravel(), nan=0.0)

        for idx in range(seq_len, len(grp), stride):
            sequences.append(feat_vals[idx - seq_len : idx])
            targets.append(targ_vals[idx - 1])

    return np.array(sequences, dtype=np.float32), np.array(targets, dtype=np.float32)

print("Building train sequence tensors...")
t_seq = time.time()
X_seq_train, y_seq_train = create_sequences_from_df(train_df, scaler, seq_len=SEQ_LEN, stride=6)
print(f" -> Train sequences: {len(X_seq_train):,} shape: {X_seq_train.shape}")

print("Building validation sequence tensors...")
X_seq_val, y_seq_val = create_sequences_from_df(val_df, scaler, seq_len=SEQ_LEN, stride=6)
print(f" -> Val sequences:   {len(X_seq_val):,} shape: {X_seq_val.shape}")

print("Building test sequence tensors...")
X_seq_test, y_seq_test = create_sequences_from_df(test_df, scaler, seq_len=SEQ_LEN, stride=6)
print(f" -> Test sequences:  {len(X_seq_test):,} shape: {X_seq_test.shape} (took {time.time()-t_seq:.1f}s)")

# PyTorch Dataset
class VEDSequenceDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.from_numpy(X)
        self.y = torch.from_numpy(y)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

train_dataset = VEDSequenceDataset(X_seq_train, y_seq_train)
val_dataset = VEDSequenceDataset(X_seq_val, y_seq_val)
test_dataset = VEDSequenceDataset(X_seq_test, y_seq_test)

BATCH_SIZE = 1024
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, pin_memory=True, num_workers=4)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, pin_memory=True, num_workers=4)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False, pin_memory=True, num_workers=4)

# ---------------------------------------------------------
# STEP 5: PYTORCH DEEP LSTM ARCHITECTURE & TRAINING
# ---------------------------------------------------------
print("\n[Step 5/6] Initializing Deep Multi-Layer LSTM Architecture...")

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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using Compute Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'Multi-core CPU'})")

model = VEDEnergyLSTM(input_dim=len(feature_cols), hidden_dim=128, num_layers=2, dropout=0.2).to(device)
criterion = nn.HuberLoss(delta=1.0)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=15, eta_min=1e-5)
use_amp = torch.cuda.is_available()
scaler_amp = torch.amp.GradScaler('cuda', enabled=use_amp)

EPOCHS = 15
print(f"\nBeginning Deep LSTM Sequence Training across {EPOCHS} Epochs...")
start_train_time = time.time()

best_val_loss = float("inf")
best_model_path = MODEL_OUTPUT_DIR / "ved_deep_lstm_power.pt"

for epoch in range(1, EPOCHS + 1):
    model.train()
    running_loss = 0.0
    epoch_start = time.time()

    for batch_X, batch_y in train_loader:
        batch_X, batch_y = batch_X.to(device, non_blocking=True), batch_y.to(device, non_blocking=True)
        optimizer.zero_grad()

        with torch.amp.autocast('cuda', enabled=use_amp):
            preds = model(batch_X)
            loss = criterion(preds, batch_y)

        scaler_amp.scale(loss).backward()
        scaler_amp.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=2.0)
        scaler_amp.step(optimizer)
        scaler_amp.update()

        running_loss += loss.item() * len(batch_y)

    scheduler.step()
    train_loss = running_loss / len(train_dataset)

    # Validation
    model.eval()
    val_loss = 0.0
    all_val_preds = []
    all_val_true = []

    with torch.no_grad():
        for batch_X, batch_y in val_loader:
            batch_X, batch_y = batch_X.to(device, non_blocking=True), batch_y.to(device, non_blocking=True)
            with torch.amp.autocast('cuda', enabled=use_amp):
                preds = model(batch_X)
                loss = criterion(preds, batch_y)
            val_loss += loss.item() * len(batch_y)
            all_val_preds.append(preds.detach().cpu().numpy())
            all_val_true.append(batch_y.detach().cpu().numpy())

    val_loss = val_loss / len(val_dataset)
    val_preds_arr = np.concatenate(all_val_preds)
    val_true_arr = np.concatenate(all_val_true)
    val_mae = np.mean(np.abs(val_preds_arr - val_true_arr))

    epoch_dur = time.time() - epoch_start
    print(f"Epoch [{epoch:02d}/{EPOCHS:02d}] — Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val MAE: {val_mae:.3f} kW ({epoch_dur:.1f}s)")

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save({
            "epoch": epoch,
            "model_state_dict": model.state_dict(),
            "scaler_mean": scaler.mean_,
            "scaler_scale": scaler.scale_,
            "feature_cols": feature_cols,
            "seq_len": SEQ_LEN,
        }, best_model_path)

print(f"\nSequence Training Complete! Total sequence training duration: {(time.time() - start_train_time) / 60:.1f} minutes")

# ---------------------------------------------------------
# STEP 6: TEST EVALUATION & METRICS EXPORT
# ---------------------------------------------------------
print("\n[Step 6/6] Final Test Set Evaluation & Dashboard Summary...")

# Load best checkpoint
checkpoint = torch.load(best_model_path, map_location=device)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

all_test_preds = []
all_test_true = []

with torch.no_grad():
    for batch_X, batch_y in test_loader:
        batch_X = batch_X.to(device)
        with torch.amp.autocast('cuda', enabled=use_amp):
            preds = model(batch_X)
        all_test_preds.append(preds.detach().cpu().numpy())
        all_test_true.append(batch_y.numpy())

y_pred_lstm = np.concatenate(all_test_preds)
y_test_seq = np.concatenate(all_test_true)

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

mae_lstm = float(mean_absolute_error(y_test_seq, y_pred_lstm))
rmse_lstm = float(np.sqrt(mean_squared_error(y_test_seq, y_pred_lstm)))
r2_lstm = float(r2_score(y_test_seq, y_pred_lstm))

print(f"\nFinal Test Results (Deep LSTM Sequence Model):")
print(f"  MAE:  {mae_lstm:.3f} kW")
print(f"  RMSE: {rmse_lstm:.3f} kW")
print(f"  R²:   {r2_lstm:.4f}")

metrics_payload = {
    "dataset": "University of Michigan Vehicle Energy Dataset (VED)",
    "model_type": "Deep Recurrent LSTM (30s Temporal Sequence Window)",
    "sequence_length_seconds": SEQ_LEN,
    "total_samples": len(X_seq_train) + len(X_seq_val) + len(X_seq_test),
    "raw_telemetry_rows": total_raw_rows,
    "vehicles_count": len(vehicle_meta),
    "features": feature_cols,
    "benchmarks": {
        "Deep LSTM (30s Temporal Window)": {
            "mae_kw": round(mae_lstm, 3),
            "rmse_kw": round(rmse_lstm, 3),
            "r2_score": round(r2_lstm, 4),
            "training_time_min": round((time.time() - start_train_time) / 60, 1),
        }
    },
    "checkpoint": str(best_model_path),
    "updated_at": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
}

with open(PUBLIC_METRICS_PATH, "w") as f:
    json.dump(metrics_payload, f, indent=2)

print(f"\nSaved metrics summary to {PUBLIC_METRICS_PATH}")
print("=" * 75)
print("  PATH B DEEP LSTM TRAINING COMPLETED!")
print("=" * 75)
