# EV Intelligence — Precision Design System

**Visual Language: Precision Telemetry Glass & Obsidian Automotive Cockpit**

---

## 1. Design Philosophy

The design system for **EV Intelligence** embodies the calculated elegance of advanced automotive software (Porsche Communication Management, Apple visionOS spatial displays, and aerospace telemetry monitors). It treats real-time electric vehicle telemetry and machine learning inferences as precision instruments rather than consumer gadgets.

### Core Principles
- **Atmospheric Neutrality:** A foundation of deep obsidian (`#08090C`) and translucent optical planes that recede into the canvas, ensuring high-contrast numeric data remains prominent.
- **Instrument Precision:** Surfaces rely on ultra-fine 1px specular edges (`rgba(255, 255, 255, 0.065)`), subtle top interior light catching, and tabular numerical figures.
- **Restrained Chromatic Feedback:** High-chroma color is restricted exclusively to physical states: electric blue for primary propulsion/status, emerald for regeneration and optimal energy, amber for grade/temperature warnings, and rose for cell drag/error.
- **No Gamification:** Avoids cartoon badges, emoji, or excessive saturation.

---

## 2. Color Palette

### Canvas & Surface Architecture
| Token | Hex / RGBA | Role |
|---|---|---|
| `Canvas Void` | `#08090C` | Deep background field for optical contrast |
| `Glass Surface 1` | `rgba(16, 20, 26, 0.70)` | Standard dashboard cards with `backdrop-filter: blur(24px)` |
| `Glass Surface 2` | `rgba(24, 30, 42, 0.80)` | Elevated dialogs, active drawers, and focused containers |
| `Glass Surface Inset` | `rgba(8, 10, 14, 0.70)` | Nested data arrays, chart canvas backdrops, and inner trays |
| `Specular Hairline` | `rgba(255, 255, 255, 0.065)` | Ultra-fine border defining glass planes |
| `Active Edge` | `rgba(255, 255, 255, 0.14)` | Hover / active edge highlight |

### Functional Accents
| Role | Hex | Application |
|---|---|---|
| **Electric Cobalt Blue** | `#38BDF8` / `#3B82F6` | Primary status, estimated range, CAN bus data, navigation active state |
| **Technical Mint / Emerald** | `#10B981` / `#2DD4BF` | Regenerative braking, optimal efficiency, ML hybrid curves, model convergence |
| **Muted Amber Warning** | `#F59E0B` | Road elevation incline, thermal boundary thresholds, simulation mode alert |
| **Restrained Coral Red** | `#F43F5E` / `#EF4444` | High drag dissipation, excessive jerk, telemetry faults |

### Typography Tones
- **Text High-Contrast:** `#F8FAFC` (100% white for scalar numbers, headings, critical values)
- **Text Muted:** `#94A3B8` (Secondary metadata, axis labels, unit denominators)
- **Text De-emphasized:** `#64748B` / `#475569` (Structural delimiters, grid lines, disabled controls)

---

## 3. Typography

- **Primary Interface Font:** `Inter` (sans-serif)
  - Headings, navigation, descriptive copy, and button labels.
  - Subtle negative tracking on titles (`-0.02em` to `-0.015em`).
- **Telemetry & Numerical Data:** `JetBrains Mono` (monospace)
  - Applied to all telemetry scalars, battery voltages, speed readouts, timestamps, coordinates, and model metrics.
  - Locked to tabular alignment (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during high-frequency live data updates.

---

## 4. Elevation & Spatial Depth

Elevation is achieved through optical refraction, frosted translucency, and edge illumination rather than heavy black drop shadows:

1. **Backdrop Layer (Level 0):** Flat `#08090C` canvas with subtle diffused vector gradients (`sky-950/20` and `emerald-950/15`).
2. **Standard Glass Panel (Level 1):** `rgba(16, 20, 26, 0.70)`, blur `24px`, 1px border `rgba(255, 255, 255, 0.065)`.
3. **Elevated Overlays & Drawers (Level 2):** `rgba(24, 30, 42, 0.80)`, blur `32px`, 1px border `rgba(255, 255, 255, 0.12)`, shadow `0 16px 40px -8px rgba(0, 0, 0, 0.7)`.
4. **Specular Highlight:** An inset shadow (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`) simulates light catching the top bevel of precision optical glass.

---

## 5. Geometry & Corner Radii

- **Top-Level Dashboard Panels:** `1.125rem` (18px) to `1.5rem` (24px) for major glass cards.
- **Embedded Sub-modules:** `0.75rem` (12px) for nested trays, following the geometric rule:
  $$\text{Radius}_{\text{inner}} = \text{Radius}_{\text{outer}} - \text{Padding}$$
- **Interactive Controls & Buttons:** `0.5rem` (8px) for tactical tactile feel.
- **Status Pills & Telemetry Badges:** Fully rounded (`9999px`) pill format with animated ping dots.

---

## 6. Layout & Responsive Breakpoints

| Breakpoint | Viewport | Grid Mechanics |
|---|---|---|
| **Mobile (`< 768px`)** | Single column | Stacked hero cards, horizontal scroll on metrics row, bottom navigation bar |
| **Tablet (`768px - 1023px`)** | 2-column grid | Collapsible sidebar drawer, two-column metric grids, docked inspector |
| **Desktop (`≥ 1024px`)** | 12-column grid | Persistent 72-wide sidebar rail, wide time-series charts, dual-column intelligence |
