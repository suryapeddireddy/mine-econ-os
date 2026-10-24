# MineEcon-OS ⛏️📈

**MineEcon-OS** is an interactive, web-based mining economics and risk simulation platform engineered specifically for **GATE Mining Engineering candidates**, **academic researchers**, and **mineral industry professionals**.

It combines real-time financial math engines with asynchronous stochastic Monte Carlo risk modeling, allowing users to analyze feasibility, sensitivity, and valuation across complex mining projects and GATE-style exam scenarios.

---

## 🚀 What Can You Use MineEcon-OS For?

### 1. GATE Mining Engineering Preparation
* **Hoskold & Morkill Valuation:** Validate complex dual-rate sinking fund calculations and present value models.
* **AISC & OPEX Metrics:** Breakdown All-In Sustaining Costs (AISC), mining/processing costs, and ad-valorem royalty structures.
* **Discounted Cash Flow (DCF):** Instant calculation of NPV, IRR, and Payback Period across varying Life-of-Mine (LOM) horizons.

### 2. Industry Feasibility & Project Evaluation
* **Indian Mining Benchmarks:** Pre-configured scenarios reflecting Indian Bureau of Mines (IBM) royalty structures, statutory taxation, and regional deposit economics (e.g., Odisha open-pit iron ore).
* **Stochastic Risk Analysis:** Run 10,000-iteration Monte Carlo simulations directly in background Web Workers to evaluate P10/P50/P90 NPV targets and Probability of Loss.
* **Real-time Sensitivity Deck:** Dynamically stress-test parameters like head grade, commodity prices, CAPEX, and OPEX via low-latency UI sliders.

---

## 🛠️ Step-by-Step Usage Guide

### Step 1: Select a Benchmark Preset
When you open MineEcon-OS, choose a starting scenario from the header bar:
* **GATE Sample Scenario:** Ideal for studying dual-rate Hoskold/Morkill exam problems.
* **Indian Open-Pit Iron Ore:** Pre-loaded with IBM royalty rates, statutory corporate taxes, and realistic throughput metrics.

### Step 2: Fine-tune Parameters in the Control Deck
Use the left sidebar **Control Deck** sliders to adjust key variables across four distinct modules:
1. **Geology & Production:** Adjust Ore Reserves ($Mt$), Annual Capacity ($Mt/y$), and Head Grade ($\%$).
2. **CAPEX & OPEX:** Tweak Initial CAPEX ($M), Mining OPEX ($/t), and Processing OPEX ($/t).
3. **Market & IBM Royalties:** Set expected Commodity Prices ($/unit), Discount Rates ($\%$), and IBM Royalty Rates ($\%$).
4. **Hoskold Parameters:** Adjust Speculative Rates ($r_1$) and Sinking Fund Rates ($r_2$).

### Step 3: Analyze Key Performance Indicators (KPIs)
Observe instant updates in the top KPI Grid:
* **Net Present Value (NPV)** and **Internal Rate of Return (IRR)**
* **Payback Period** (Years)
* **Hoskold Present Value ($V_p$)**
* **All-In Sustaining Cost (AISC)** per unit of finished product

### Step 4: Explore Analytics & Monte Carlo Risk Profiles
* **Cash Flow Waterfall & Cumulative NPV Chart:** Track LOM annual net free cash flows alongside cumulative discounted returns.
* **Monte Carlo Distribution Histogram:** Inspect the stochastic risk curve to identify P10 (Pessimistic), P50 (Median), and P90 (Optimistic) financial outcomes alongside the total Probability of Loss ($\text{NPV} < 0$).

---

## 🧮 Mathematical Engine Overview

MineEcon-OS incorporates standard financial equations used in mining engineering literature and GATE curricula:

### 1. Hoskold Valuation Formula
$$V_p = \frac{A}{r_1 + \frac{r_2}{(1 + r_2)^n - 1}}$$
*Where $A$ is annual uniform profit, $r_1$ is the speculative interest rate, $r_2$ is the sinking fund interest rate, and $n$ is the mine life in years.*

### 2. Morkill Valuation Formula
$$V_p = A \cdot \left[ \frac{(1 + r_1)^n - 1}{r_1 (1 + r_1)^n} \right]$$

### 3. All-In Sustaining Cost (AISC)
$$\text{AISC} = \frac{\text{Mining OPEX} + \text{Processing OPEX} + \text{Transport} + \text{Sustaining CAPEX} + \text{Royalties}}{\text{Total Recoverable Metal Unit}}$$

---

## 💻 Tech Stack

* **Framework:** Next.js (App Router, React 19)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Dark theme / Industrial glassmorphic design)
* **Visualization:** Recharts
* **Asynchronous Computation:** Web Workers (Monte Carlo Simulation engine using Box-Muller normal transforms)
* **Icons:** Lucide React

---

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mineecon-os.git
   cd mineecon-os
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).