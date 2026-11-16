# Vehicle Energy Dataset (VED) — Dynamic Driving Data (`data_csv_copy/`)

This directory contains the weekly chronological driving telemetry logs from the **University of Michigan Vehicle Energy Dataset (VED)**.

---

## 📊 Overview

- **Source:** University of Michigan VED (Ann Arbor, MI)
- **Timeframe:** November 2017 – November 2018 (54 consecutive weekly CSV files)
- **Sampling Frequency:** ~1 Hz to 10 Hz depending on signal
- **Vehicles:** 384 unique vehicles (EV, PHEV, HEV, and ICE)
- **Total Records:** 22,436,808 raw telemetry rows across 54 weeks

---

## 📁 File Naming Convention

Each CSV covers one weekly ingestion batch named `VED_YYMMDD_week.csv`:
- `VED_171101_week.csv` → Week starting Nov 01, 2017
- `VED_171108_week.csv` → Week starting Nov 08, 2017
- `...`
- `VED_181107_week.csv` → Week starting Nov 07, 2018

---

## 📋 Data Schema

| Column | Unit | Description |
|---|---|---|
| `DayNum` | Days | Fractional epoch day since study baseline |
| `VehId` | Integer | Anonymized unique vehicle identifier |
| `Trip` | Integer | Chronological trip counter per vehicle |
| `Timestamp(ms)` | Milliseconds | In-trip elapsed time |
| `Latitude[deg]` | Degrees | GPS latitude |
| `Longitude[deg]` | Degrees | GPS longitude |
| `Vehicle Speed[km/h]` | km/h | OBD-II vehicle ground velocity |
| `MAF[g/sec]` | g/s | Mass air flow (ICE vehicles) |
| `Engine RPM[RPM]` | RPM | Internal combustion engine speed |
| `Absolute Load[%]` | % | Engine absolute load percentage |
| `OAT[DegC]` | °C | Outside ambient air temperature |
| `Fuel Rate[L/hr]` | L/h | Instantaneous fuel consumption rate |
| `Air Conditioning Power[kW]` | kW | HVAC compressor electrical draw |
| `Air Conditioning Power[Watts]` | Watts | HVAC compressor electrical draw |
| `Heater Power[Watts]` | Watts | Cabin electric heater / heat pump draw |
| `HV Battery Current[A]` | Amperes | High-voltage pack current (+ discharge, - regen) |
| `HV Battery SOC[%]` | % | High-voltage battery state of charge (0–100%) |
| `HV Battery Voltage[V]` | Volts | High-voltage pack DC bus potential |
| `Short/Long Term Fuel Trim` | % | Fuel injection adjustment (ICE only) |

---

## ⚡ Usage in Training Pipeline

The machine learning pipelines in `ml/training/` ingest these raw CSV files directly to extract:
1. Ground speed, acceleration, and aerodynamic power proxies ($v, v^2, v^3$)
2. Battery electrical power $P = V \times I$ (target label)
3. Regenerative braking indicators and HVAC auxiliary load
4. Chronological train/validation/test holdout splits by `DayNum`
