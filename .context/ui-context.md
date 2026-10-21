# UI Context

## Theme

Dark Obsidian Command Deck only. The visual aesthetic conveys high-tech scientific computing and financial engineering.

All colors rely on CSS custom properties or standard dark utility classes in Tailwind.

| Role             | Hex / Value                | Application                                                  |
| ---------------- | -------------------------- | ------------------------------------------------------------ |
| Page Background  | `#030712` (Gray 950)       | Main workspace background                                    |
| Card Surface     | `#0b0f19` / `#111827`      | Control panels, chart cards, metric boxes                   |
| Card Border      | `#1f2937` (Gray 800)       | Subtle 1px borders                                           |
| Primary Text     | `#f9fafb` (Gray 50)        | Metrics, main titles, high contrast                          |
| Secondary Text   | `#9ca3af` (Gray 400)       | Subtitles, parameter labels                                  |
| Cyan Accent      | `#06b6d4` / `#22d3ee`      | Primary slider controls, active tabs, main metrics           |
| Emerald Accent   | `#10b981`                  | Positive cash flows, high NPV indicators, profit indicators  |
| Crimson Accent   | `#ef4444`                  | Losses, negative NPV, high cost overrun indicators           |
| Amber Accent     | `#f59e0b`                  | Royalties, statutory taxes, warning thresholds              |

## Typography

- **UI & Controls:** Inter / Geist Sans.
- **Numbers, Codes & Ledgers:** Geist Mono / JetBrains Mono (monospaced for aligned tabular financial figures).

## Layout Pattern

- **Top Bar:** Scenario title, active preset loader, `[ Load GATE Sample ]` button, `[ Save to Supabase ]` button.
- **Left Panel (Control Deck):** Fixed-width collapsible sidebar with grouped sliders (Reserves & Geology, OPEX & CAPEX, Commodity & Taxes, Valuation & Hoskold).
- **Main Workspace (Right):**
  - **Top Row:** Glowing KPI Stat Cards (NPV, IRR, Payback, Hoskold Value, AISC/unit).
  - **Middle Row:** Tabbed visual charts (Cash Flow Waterfall, Tornado Sensitivity, Monte Carlo Distribution, Sinking Fund Accumulation).
  - **Bottom Row:** Multi-Year LOM Financial Ledger Table.