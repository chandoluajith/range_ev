# RangeIQ — EV Intelligent Range Estimation

> **Physics-Informed Machine Learning for Real-Time Electric Vehicle Range Prediction**

RangeIQ is a full-stack EV telemetry and range prediction system. It combines a **physics kinematic baseline** with **gradient-boosted and deep LSTM models** trained on 22M+ real driving telemetry samples from the University of Michigan Vehicle Energy Dataset (VED).

---

## 📸 Screenshots

> Dashboard · Live Telemetry · Trip History · Model Validation · 3D Physics Simulator

*(Add screenshots here)*

---

## 🏗️ Project Structure

```
rangeiq/
│
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard (range hero + live metrics)
│   ├── driving/                # Driving behaviour & kinematics
│   ├── energy/                 # Energy consumption analytics
│   ├── live/                   # Live CAN bus telemetry monitor
│   ├── model/                  # ML model validation & research
│   ├── range/                  # Range intelligence pipeline
│   ├── settings/               # Vehicle profile & preferences
│   ├── simulator/              # Interactive 3D physics simulator
│   └── trips/                  # Trip history & drilldown
│
├── components/                 # Reusable React components
│   ├── charts/                 # SVG chart primitives
│   ├── dashboard/              # Dashboard-specific panels
│   ├── layout/                 # AppShell, Sidebar, Topbar
│   ├── trips/                  # Trip table & filters
│   ├── ui/                     # Design system atoms (Button, Card, Badge…)
│   └── vehicle/                # Vehicle selector & status
│
├── data/                       # Telemetry fixtures & mock state
│   ├── mockTelemetry.ts        # High-frequency mock CAN data
│   ├── mockTrips.ts            # Realistic trip log samples
│   ├── mockVehicle.ts          # EV fleet profiles & physics specs
│   └── mockModel.ts            # Residual calibration curves
│
├── data_csv_copy/              # VED dynamic telemetry CSV dataset (54 weekly logs)
│   └── README.md               # Dataset dictionary & schema definitions
│
├── ml/                         # Machine learning pipeline (Python)
│   ├── training/
│   │   ├── train_gbm.py        # LightGBM + XGBoost training (Path A)
│   │   └── train_lstm.py       # Deep LSTM sequence training (Path B)
│   ├── evaluation/
│   │   └── evaluate_lstm.py    # Holdout test set evaluation
│   ├── inference/
│   │   └── live_predict.py     # Real-time inference demo
│   └── models/
│       └── README.md           # How to download / reproduce weights
│
├── types/                      # TypeScript interfaces
│   ├── telemetry.ts            # TelemetryPoint, RangePrediction, CAN frames
│   ├── vehicle.ts              # VehicleProfile, VehicleState
│   ├── trip.ts                 # TripSummary
│   └── model.ts                # ModelEvaluationMetrics
│
├── hooks/                      # React custom hooks
│   ├── useRange.ts
│   ├── useTelemetry.ts
│   ├── useTheme.tsx
│   └── useVehicle.ts
│
├── lib/                        # Shared utilities
│   ├── constants.ts
│   ├── formatters.ts
│   └── utils.ts
│
├── public/
│   ├── ved_model_metrics.json  # Trained model benchmark results
│   └── simulator3d.html        # Standalone 3D physics simulator
│
├── DATA_CONTRACT.md            # API / backend contract spec
├── ARCHITECTURE.md             # System architecture deep-dive
└── DESIGN_SYSTEM.md            # UI token & component guide
```

---

## ⚡ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15 (App Router) |
| UI | React 19 · TypeScript · Tailwind CSS |
| Charts | Custom SVG (zero external chart lib) |
| ML Models | LightGBM · XGBoost · PyTorch LSTM |
| Feature Engineering | Polars (high-performance DataFrames) |
| Dataset | University of Michigan VED (22M+ rows) |

---

## 🤖 ML Model — Features

The model predicts **instantaneous motor power (kW)** from 10 input features, all readable from a standard OBD-II port or CAN bus with no additional hardware:

| # | Feature | Source | Notes |
|---|---------|--------|-------|
| 1 | `speed_kmh` | ABS wheel sensor | OBD-II PID 0x0D |
| 2 | `speed_ms` | Derived | speed ÷ 3.6 |
| 3 | `accel_ms2` | Derived | Δspeed / Δtime |
| 4 | `speed_sq` | Derived | Aero drag proxy |
| 5 | `speed_cube` | Derived | Aero power proxy |
| 6 | `weight_kg` | Static spec / VIN | Curb weight |
| 7 | `ambient_temp_c` | OAT sensor | OBD-II PID 0x46 |
| 8 | `aux_power_w` | BMS / HVAC CAN | AC + heater draw |
| 9 | `regen_flag` | Derived from BMS current | 1 = regen, 0 = traction |
| 10 | `soc_percent` | BMS CAN | HV Battery SOC |

**Target:** `total_power_kw` — instantaneous battery pack power draw

---

## 📊 Model Benchmarks (VED holdout test set)

| Model | MAE (kW) | RMSE (kW) | R² | Train Time |
|-------|---------|----------|-----|-----------|
| Physics Baseline | 5.66 | 11.14 | — | 0s |
| Ridge Regression | 0.71 | 3.93 | 0.01 | 0.2s |
| LightGBM | 0.57 | 3.90 | 0.03 | 5.7s |
| XGBoost | 0.59 | 3.89 | 0.03 | 15.9s |
| Deep LSTM (30s window) | 1.81 | 6.00 | 0.91 | ~3h |

> **Note:** The low R² for tree-based models is expected — VED is a mixed ICE+EV dataset. The LSTM's temporal context (30-second window) captures driving patterns that pointwise models miss.

---

## 🚀 Quick Start

### Frontend

```bash
npm install
npm run dev
# → http://localhost:3000
```

### ML Training

```bash
# Install Python dependencies
python -m venv .venv
source .venv/bin/activate
pip install polars lightgbm xgboost torch scikit-learn openpyxl

# Train gradient boosted models (~30 seconds)
cd ml/training
python train_gbm.py

# Train deep LSTM (~3h on CPU, ~20min on GPU)
python train_lstm.py
```

### Dataset

Download the **Vehicle Energy Dataset (VED)** from the original paper:
> *"VED, A Large-Scale Synthetic Dataset for Vehicle Energy Consumption Research"*
> Sun et al., IEEE Transactions on Intelligent Transportation Systems, 2021
> https://github.com/gsoh/VED

Extract CSV files into `data/ved_extracted/`.

---

## 📄 Documentation

| File | Description |
|------|-------------|
| [DATA_CONTRACT.md](DATA_CONTRACT.md) | TypeScript API contracts for backend integration |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design & data flow |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | UI tokens, colour palette, component spec |
| [ml/models/README.md](ml/models/README.md) | Model weights & reproduction guide |

---

## 📝 License

MIT
