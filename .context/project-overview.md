# MineEcon-OS

## Overview

MineEcon-OS is an interactive, real-time Mine Economics & Financial Risk Simulator tailored for mining engineers, investors, and students preparing for the GATE Mining Engineering exam. Instead of static spreadsheets, MineEcon-OS provides a reactive "Command Deck" workspace where tweaking operational variables (ore grades, mining costs, commodity prices, tax slabs, royalties) immediately updates multi-year cash flow projections, net present values, and risk distributions in real time.

## Goals

1. Provide an interactive financial simulation deck covering the entire GATE Mineral Economics syllabus (DCF, Hoskold Valuation, Morkill Valuation, IBM Royalties, UNFC Reserve Classification, and Kenneth Lane Cut-Off Grade Optimization).
2. Deliver instant 60 FPS feedback via a pure, deterministic financial calculation engine in TypeScript.
3. Offer non-blocking background Monte Carlo risk simulations (10,000+ iterations via Web Workers) to plot P10/P50/P90 probability density distributions.
4. Render executive-level analytics charts (Cash Flow Waterfall, Tornado Sensitivity Analysis, Sinking Fund accumulation curves).
5. Support preset case studies (real past GATE questions, Indian iron ore/copper mine benchmarks) and scenario saving/comparison via Supabase PostgreSQL.

## Core User Flow

1. User opens the MineEcon-OS workspace.
2. User selects an operational preset (e.g., "GATE 2024 Sample Problem" or "Odisha Open-Pit Iron Ore") or configures custom inputs.
3. User adjusts real-time sliders for geology, costs, prices, or valuation parameters.
4. The calculation engine updates live KPI Cards (NPV, IRR, Payback, Hoskold Value, AISC) and the multi-year Financial Ledger.
5. User triggers or views automatic Monte Carlo risk distributions and sensitivity charts.
6. User saves custom scenarios to Supabase and performs side-by-side comparative analysis.

## Features

### Financial & Engineering Modules

- **DCF & LOM Cash Flow Ledger:** Multi-year cash flow schedules with auto-computed NPV, IRR, Payback, and AISC/unit.
- **GATE Valuation Engine:** Side-by-side Hoskold Two-Rate and Morkill valuation models with sinking fund interest tracking.
- **Taxation & IBM Royalty Calculator:** Indian Bureau of Mines (IBM) ad-valorem royalty rules, corporate tax shields, and statutory levies.
- **Kenneth Lane Cut-Off Grade Optimizer:** Multi-year cut-off grade profile balancing mine, mill, and market throughput constraints.
- **Monte Carlo Risk Engine:** Non-blocking background Web Worker thread running 10,000 stochastic iterations for risk analysis.

### Persistence & Scenarios

- Supabase integration for persisting mine project scenarios.
- Side-by-side comparison matrix for evaluating *Base Case* vs. *High Royalty* vs. *Low Price* scenarios.

## Scope

### In Scope

- Real-time reactive slider controls & KPI metric displays
- Pure deterministic TypeScript financial math engine
- Non-blocking Web Worker Monte Carlo background thread
- Recharts analytical suite (Waterfall, Tornado, Bell Curve, Sinking Fund)
- Pre-configured GATE exam question solvers and Indian mine case studies
- Supabase persistence for saving scenarios
- KaTeX formula explainer tooltips

### Out Of Scope

- 3D WebGPU block model mesh rendering
- Real-time multi-user live multiplayer canvas editing
- Automated live stock market API streaming (manual input benchmark price toggles used instead)