import type { AnnualCashFlow, FinancialResults, MineParameters } from '../types/economics';

const MILLION = 1_000_000;

function validate(params: MineParameters): void {
  for (const [key, value] of Object.entries(params)) {
    if (key !== 'name' && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
      throw new RangeError(`${key} must be a finite, nonnegative number`);
    }
  }
  for (const key of ['headGrade', 'miningRecovery', 'processingRecovery', 'royaltyRate', 'corporateTaxRate'] as const) {
    if (params[key] > 100) throw new RangeError(`${key} must be between 0 and 100`);
  }
  if (params.totalTonnage <= 0 || params.annualMiningCapacity <= 0) {
    throw new RangeError('totalTonnage and annualMiningCapacity must be positive');
  }
  if (Math.ceil(params.totalTonnage / params.annualMiningCapacity) > 100_000) {
    throw new RangeError('Mine life exceeds 100,000 annual periods');
  }
}

/** Solve conventional cash flows in log(1 + rate) space, including negative IRRs. */
function calculateIRR(investment: number, flows: number[]): number {
  if (investment <= 0 || !flows.some(value => value > 0) || flows.some(value => value < 0)) return NaN;
  const npvAt = (logRate: number) => flows.reduce(
    (npv, flow, index) => npv + (flow === 0 ? 0 : flow * Math.exp(-(index + 1) * logRate)),
    -investment,
  );
  let low = -1;
  let high = 1;
  while (npvAt(low) < 0 && low > -512) low *= 2;
  while (npvAt(high) > 0 && high < 1024) high *= 2;
  for (let iteration = 0; iteration < 200; iteration++) {
    const midpoint = (low + high) / 2;
    if (npvAt(midpoint) > 0) low = midpoint;
    else high = midpoint;
  }
  return Math.expm1((low + high) / 2) * 100;
}

/**
 * Unlevered, end-of-year cash flow model, without depreciation or loss carryforwards.
 * Capacity depletes in-situ ore; mining recovery determines recovered feed tonnes.
 * Mining cost applies to in-situ tonnes; processing, transport, sustaining CAPEX,
 * and IBM ad-valorem royalties apply to recovered feed. No waste stripping is assumed.
 * The final partial year is booked at its year end. Hoskold/Morkill use fractional
 * mine life and the average annual operating FCF, before initial investment.
 */
export function calculateMineFinancials(params: MineParameters): FinancialResults {
  validate(params);
  const life = params.totalTonnage / params.annualMiningCapacity;
  const periods = Math.ceil(life);
  const investment = params.initialCapex * MILLION;
  const discount = params.discountRate / 100;
  const speculative = params.speculativeRate / 100;
  const sinking = params.sinkingFundRate / 100;
  const annualLedger: AnnualCashFlow[] = [{
    year: 0, oreMined: 0, wasteMined: 0, metalProduced: 0, grossRevenue: 0,
    miningCost: 0, processingCost: 0, royaltiesPaid: 0, taxableIncome: 0, taxPaid: 0,
    netFreeCashFlow: -investment, discountedCashFlow: -investment, cumulativeNPV: -investment,
  }];
  let cumulativeNPV = -investment;
  let cumulativeCash = -investment;
  let paybackPeriod = investment === 0 ? 0 : Infinity;
  let totalCosts = 0;
  let totalMetal = 0;
  let totalOperatingCash = 0;

  for (let year = 1; year <= periods; year++) {
    const inSituTonnes = Math.min(params.annualMiningCapacity,
      Math.max(0, params.totalTonnage - (year - 1) * params.annualMiningCapacity)) * MILLION;
    const oreMined = inSituTonnes * params.miningRecovery / 100;
    const metalProduced = oreMined * params.headGrade / 100 * params.processingRecovery / 100;
    const grossRevenue = metalProduced * params.commodityPrice;
    const miningCost = inSituTonnes * params.miningOpexPerTon;
    const processingCost = oreMined * params.processingOpexPerTon;
    const transportCost = oreMined * params.transportCostPerTon;
    const sustainingCapex = oreMined * params.sustainingCapexPerTon;
    const royaltiesPaid = oreMined * params.ibmBenchmarkPrice * params.royaltyRate / 100;
    const operatingCosts = miningCost + processingCost + transportCost + royaltiesPaid;
    // Sustaining capital is a cash outflow, not an immediate tax deduction.
    const taxableIncome = Math.max(0, grossRevenue - operatingCosts);
    const taxPaid = taxableIncome * params.corporateTaxRate / 100;
    const netFreeCashFlow = grossRevenue - operatingCosts - sustainingCapex - taxPaid;
    const discountedCashFlow = netFreeCashFlow / (1 + discount) ** year;
    cumulativeNPV += discountedCashFlow;
    if (paybackPeriod === Infinity && netFreeCashFlow > 0 && cumulativeCash + netFreeCashFlow >= 0) {
      paybackPeriod = year - 1 + (-cumulativeCash / netFreeCashFlow);
    }
    cumulativeCash += netFreeCashFlow;
    totalOperatingCash += netFreeCashFlow;
    totalCosts += operatingCosts + sustainingCapex;
    totalMetal += metalProduced;
    annualLedger.push({ year, oreMined, wasteMined: 0, metalProduced, grossRevenue,
      miningCost, processingCost, royaltiesPaid, taxableIncome, taxPaid,
      netFreeCashFlow, discountedCashFlow, cumulativeNPV });
  }

  const averageCash = totalOperatingCash / life;
  const sinkingFactor = sinking === 0 ? 1 / life : sinking / Math.expm1(life * Math.log1p(sinking));
  const annuityFactor = speculative === 0 ? life : -Math.expm1(-life * Math.log1p(speculative)) / speculative;
  return {
    npv: cumulativeNPV,
    irr: calculateIRR(investment, annualLedger.slice(1).map(row => row.netFreeCashFlow)),
    paybackPeriod,
    hoskoldValue: averageCash / (speculative + sinkingFactor),
    morkillValue: averageCash * annuityFactor,
    aiscPerUnit: totalMetal > 0 ? totalCosts / totalMetal : Infinity,
    annualLedger,
  };
}
