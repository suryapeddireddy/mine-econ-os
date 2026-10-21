# Architecture Context

## Stack

| Layer            | Technology                  | Role                                                           |
| ---------------- | --------------------------- | -------------------------------------------------------------- |
| Framework        | Next.js 15 + TypeScript     | App Router, client-side reactivity, server endpoints           |
| UI / Styling     | Tailwind CSS v4 + Lucide    | Obsidian command-deck theme & UI icons                         |
| Charts / Viz     | Recharts + KaTeX            | High-detail financial visualizations & LaTeX math formatting   |
| Math Engine      | Pure TypeScript Functions   | Deterministic DCF, Hoskold, Morkill, Lane calculations         |
| Web Worker       | Native Web Worker API       | Off-thread 10,000-iteration Monte Carlo simulation             |
| Database         | Supabase (PostgreSQL)       | Storing saved mine scenarios and user preferences              |

## System Boundaries

- `src/lib/calculations.ts` — Pure, deterministic math functions. Zero UI or React dependencies.
- `src/workers/` — Isolated Web Worker scripts executing heavy iterative Monte Carlo simulations.
- `src/types/economics.ts` — Strict data contracts and interfaces across inputs, ledgers, and outputs.
- `src/components/controls/` — Slider inputs, numerical form controls, and preset selectors.
- `src/components/analytics/` — Recharts visualization components (Waterfall, Tornado, Monte Carlo, Hoskold).
- `src/components/ledger/` — Multi-year financial ledger data grid.
- `src/lib/supabase.ts` — Supabase database client for saving and loading project scenarios.

## Data & Computation Flow

1. **User Input Phase:** User moves a slider in `ControlDeck.tsx`.
2. **Deterministic Calculation Phase:** Updated `MineParameters` are passed to `calculateMineFinancials()` in `src/lib/calculations.ts`. Results update React state for KPI cards and the `FinancialLedgerTable`.
3. **Async Simulation Phase:** A web worker inside `src/workers/monteCarlo.worker.ts` receives the updated parameters, runs 10,000 stochastic variations, and posts back `MonteCarloResult` to render `MonteCarloHistogram.tsx`.
4. **Persistence Phase:** Clicking "Save Scenario" writes `MineParameters` and metadata to Supabase (`mine_scenarios` table).

## Invariants

1. All core mathematical functions must remain pure and deterministic inside `src/lib/calculations.ts`.
2. Heavy iterative loops (>1,000 iterations) MUST run inside Web Workers to avoid blocking the UI thread.
3. Zero `any` types. Strict TypeScript contracts must be enforced at every system boundary.
4. Formatted currency outputs must maintain consistent units ($Millions vs.$ per tonne).