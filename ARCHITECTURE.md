# EV Intelligence — Frontend System Architecture

**Physics-Informed Personalized Energy Consumption & Dynamic Driving Range Estimation for Electric Vehicles**

---

## 1. Architectural Overview & Boundaries

The **EV Intelligence** application is an engineering-grade telemetry and predictive range dashboard. It is designed and structured as a **frontend-only, production-ready system** adhering to strict separation of concerns.

> **CRITICAL BOUNDARY DEFINITION:**  
> This system is built strictly as a client-side architecture. It contains **no** backend server, database, authentication service, IoT gateway, or server-side Python calculations. All runtime dynamic state is managed through typed data contracts and reactive client-side hooks, ensuring seamless drop-in connectivity when a real vehicle telemetry server and ML inference API are deployed.

### Current Runtime Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 / Next.js UI                │
│ (App Router Pages: /, /live, /energy, /range, etc.)    │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                    Reactive Hooks Layer                │
│    (useTelemetry, useRange, useVehicle, useSimulation) │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                   Mock Data & Contracts                │
│ (types/telemetry.ts, types/vehicle.ts, data/mock*.ts)  │
└────────────────────────────────────────────────────────┘
```

### Future Production Architecture (Backend & ML Integration)

When deploying to a physical fleet or edge server:

```text
       CAN Bus / OBD-II / Cloud IoT / Dataset
                         ↓
             Backend Telemetry Gateway (gRPC / WebSocket)
                         ↓
  Physics-Informed Neural Network (PINN) + Physics Model (C++/Python)
                         ↓
      REST / WebSocket API Server (FastAPI / Node.js)
                         ↓
           Typed Frontend API Client Service
                         ↓
        React UI Components & Visualizations (Unchanged)
```

Because the frontend is strictly decoupled from data generation, the UI components do not need redesigning or refactoring when connected to real backend endpoints.

---

## 2. Directory & Component Hierarchy

```text
ev-intelligence/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Primary Overview Dashboard (/)
│   ├── live/page.tsx                 # Live Telemetry Monitor (/live)
│   ├── energy/page.tsx               # Energy & Powertrain Analytics (/energy)
│   ├── range/page.tsx                # Predictive Range Intelligence (/range)
│   ├── driving/page.tsx              # Kinematic & Driving Behavior (/driving)
│   ├── model/page.tsx                # Model Performance & Loss Metrics (/model)
│   ├── trips/page.tsx                # Filterable Trip History (/trips)
│   ├── settings/page.tsx             # Configuration & Physics Editor (/settings)
│   ├── layout.tsx                    # Root Layout with Font & AppShell wrapper
│   └── globals.css                   # Obsidian Dark theme, glassmorphic styles
│
├── components/                       # Component-Driven Architecture
│   ├── layout/
│   │   ├── AppShell.tsx              # Shell with ambient visionOS glow fields
│   │   ├── Sidebar.tsx               # Collapsible desktop/tablet navigation
│   │   ├── Topbar.tsx                # Vehicle selector, live sync pill, actions
│   │   └── MobileNav.tsx             # Bottom navigation bar for mobile
│   ├── dashboard/
│   │   ├── RangeHero.tsx             # Hero range display with circular SVG gauge
│   │   ├── VehicleMetrics.tsx        # Responsive vehicle telemetry metrics row
│   │   ├── EnergyChart.tsx           # Multi-series actual/physics/ML time-series
│   │   ├── RangeIntelligence.tsx     # 3-step convergence pipeline visualizer
│   │   ├── DrivingBehaviorCard.tsx   # Kinematic scorecards & sparkline trend
│   │   ├── ExplainabilityPanel.tsx   # SHAP factor attribution breakdown
│   │   ├── TripSummary.tsx           # Current trip 6-metrics grid & elevation bar
│   │   └── ModelPerformance.tsx      # MAE/RMSE/R² metrics & scatter plot
│   ├── charts/
│   │   ├── LineChart.tsx             # High-resolution SVG multi-channel line chart
│   │   ├── AreaChart.tsx             # Area chart with gradient luminescence
│   │   ├── ComparisonChart.tsx       # Benchmark bars comparing baseline vs hybrid
│   │   └── DistributionChart.tsx     # Segmented energy loss breakdown bar
│   ├── trips/
│   │   ├── TripTable.tsx             # Sortable & searchable trip sessions
│   │   ├── TripFilters.tsx           # Search, style, status, and sorting bar
│   │   └── TripDetails.tsx           # Modal drawer with elevation & loss drills
│   ├── vehicle/
│   │   ├── VehicleSelector.tsx       # Fleet vehicle switcher dropdown
│   │   └── VehicleStatus.tsx         # Connection and CAN synchronization status
│   └── ui/
│       ├── Badge.tsx                 # Status pills with optional live pulsing dots
│       ├── Button.tsx                # Glassmorphic and primary tactical triggers
│       ├── Card.tsx                  # Translucent optical glass containers
│       ├── Metric.tsx                # Standardized automotive telemetry card
│       ├── Select.tsx                # Industrial styled select input
│       ├── Tooltip.tsx               # Floating visionOS hover cards
│       └── Skeleton.tsx              # Loading placeholders
│
├── data/                             # Mock Data Fixtures
│   ├── mockVehicle.ts                # Vehicle profiles & initial state
│   ├── mockTelemetry.ts              # Real-time metrics & CAN frames
│   ├── mockTrips.ts                  # Historical trip sessions with elevation logs
│   └── mockModel.ts                  # Cross-validation metrics, residuals, SHAP
│
├── hooks/                            # Reactive State Management
│   ├── useTelemetry.ts               # CAN simulation loop, scenarios, data stream
│   ├── useRange.ts                   # Range estimation & sensitivity workbench
│   └── useVehicle.ts                 # Active vehicle selection & physics tuning
│
├── lib/                              # Utilities & Constants
│   ├── constants.ts                  # App metadata, nav links, default vehicle specs
│   ├── formatters.ts                 # Engineering units & number formatting
│   └── utils.ts                      # CSS class concatenation (twMerge + clsx)
│
├── types/                            # Type Definitions & Data Contracts
│   ├── vehicle.ts                    # Vehicle profile, fleet & CAN state
│   ├── telemetry.ts                  # Telemetry point, prediction, IMU, CAN frame
│   ├── trip.ts                       # Trip session, elevation slice, loss segments
│   └── model.ts                      # MAE/RMSE, ablation, residuals, loss epochs
│
├── ARCHITECTURE.md                   # This document
├── COMPONENTS.md                     # Component catalog & interface documentation
├── DESIGN_SYSTEM.md                  # Visual specs, typography, colors, layout rules
├── DATA_CONTRACT.md                  # Frontend API contracts for future backend
└── README.md                         # Quickstart & operational instructions
```

---

## 3. State Management & Data Flow

State is managed locally through React hooks without heavy external state libraries:

1. **`useTelemetry`**:
   - Manages a continuous interval that simulates real-time CAN bus telemetry micro-variations.
   - Handles operational scenarios: *Alpine Ascent*, *Highway Cruise*, *Urban Stop & Go*, *Downhill Regen*.
   - Controls playback state (Play / Pause) and time-window slices (5 min, 15 min, 30 min, Full Trip).
2. **`useRange`**:
   - Computes dynamic range estimates based on the physics baseline, ML adjustment, and interactive sensitivity inputs.
   - Sensitivity sliders dynamically alter ambient temperature, HVAC power, driver aggression multiplier, and payload weight.
3. **`useVehicle`**:
   - Manages active fleet vehicle selection (Porsche Taycan GTS, Tesla Model S Plaid, Audi RS e-tron GT, Hyundai Ioniq 5).
   - Allows live editing and saving of vehicle physical parameters (Cd, frontal area, mass, Crr, efficiency).

---

## 4. Chart & Visualization Architecture

All charts are implemented using **pure, lightweight, responsive SVG** rather than bulky third-party canvas engines.

Benefits:
- **Zero layout shift & responsive resizing:** SVGs utilize responsive `viewBox` coordinates that scale seamlessly across 4K displays, tablets, and smartphones.
- **Micro-glow effects:** Native SVG filters (`drop-shadow`, linear gradients, dashed stroke arrays) mirror automotive cockpit heads-up displays (HUD).
- **Interactive Scrubber:** Mouse coordinates are normalized to the data array index to render floating glass tooltips with exact timestamp, power, SOC, and speed.

---

## 5. Responsive Design Strategy

- **Desktop (≥ 1280px):** 12-column grid. Persistent lateral telemetry navigation rail, wide time-series charts, dual-column intelligence sections.
- **Tablet (768px – 1279px):** Two-column stacked cards. Sidebar collapses into a drawer; topbar retains fleet and simulation toggles.
- **Mobile (< 768px):** Single-column layout. High-priority metrics stack vertically. Key metrics row horizontally scrolls without crushing tabular figures. Mobile bottom navigation bar provides thumb-friendly navigation.
