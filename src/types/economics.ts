/** Tonnage inputs are Mt, initial CAPEX is $M, and percentages use 0–100. */
export interface MineParameters {
  name: string;
  totalTonnage: number;
  headGrade: number;
  miningRecovery: number;
  processingRecovery: number;
  annualMiningCapacity: number;
  initialCapex: number;
  sustainingCapexPerTon: number;
  miningOpexPerTon: number;
  processingOpexPerTon: number;
  transportCostPerTon: number;
  /** Dollars per tonne of final metal. */
  commodityPrice: number;
  discountRate: number;
  ibmBenchmarkPrice: number;
  royaltyRate: number;
  corporateTaxRate: number;
  speculativeRate: number;
  sinkingFundRate: number;
}

/** Quantities are tonnes; all monetary values are dollars. Year 0 is investment. */
export interface AnnualCashFlow {
  year: number;
  oreMined: number;
  wasteMined: number;
  metalProduced: number;
  grossRevenue: number;
  miningCost: number;
  processingCost: number;
  royaltiesPaid: number;
  taxableIncome: number;
  taxPaid: number;
  netFreeCashFlow: number;
  discountedCashFlow: number;
  cumulativeNPV: number;
}

export interface FinancialResults {
  npv: number;
  /** Annual percentage; NaN if no unique IRR exists. */
  irr: number;
  /** Undiscounted years, interpolated within a year; Infinity if never repaid. */
  paybackPeriod: number;
  /** Capitalized operating cash flows before deduction of initial CAPEX, in dollars. */
  hoskoldValue: number;
  morkillValue: number;
  /** Dollars per tonne of final metal; Infinity if no metal is produced. */
  aiscPerUnit: number;
  annualLedger: AnnualCashFlow[];
}

export interface MonteCarloHistogramBin {
  bin: string;
  count: number;
}

export interface MonteCarloResult {
  p10NPV: number;
  p50NPV: number;
  p90NPV: number;
  lossProbability: number;
  distributionHistogram: MonteCarloHistogramBin[];
}

export interface PresetScenario {
  id: string;
  title: string;
  category: 'GATE_SAMPLE' | 'INDIAN_MINE' | 'CRITICAL_MINERAL';
  description: string;
  params: MineParameters;
}
