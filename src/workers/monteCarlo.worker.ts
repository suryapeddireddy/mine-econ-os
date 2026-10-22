import { calculateMineFinancials } from '@/lib/calculations';
import type { MineParameters, MonteCarloResult } from '@/types/economics';

interface MonteCarloRequest {
  params: MineParameters;
  iterations?: number;
}

function sampleNormal(mean: number, stdDev: number): number {
  // 1 - random is in (0, 1], keeping log away from zero.
  const magnitude = Math.sqrt(-2 * Math.log(1 - Math.random()));
  return mean + stdDev * magnitude * Math.cos(2 * Math.PI * Math.random());
}

function percentile(sorted: number[], fraction: number): number {
  const position = (sorted.length - 1) * fraction;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

self.onmessage = (event: MessageEvent<MonteCarloRequest>) => {
  const { params, iterations = 10_000 } = event.data;
  if (!Number.isSafeInteger(iterations) || iterations <= 0) {
    throw new RangeError('iterations must be a positive safe integer');
  }

  const npvs: number[] = [];
  let losses = 0;
  const vary = (value: number) => Math.max(0, sampleNormal(value, value * 0.1));

  for (let iteration = 0; iteration < iterations; iteration++) {
    const simulatedParams: MineParameters = {
      ...params,
      headGrade: Math.min(100, vary(params.headGrade)),
      commodityPrice: vary(params.commodityPrice),
      miningOpexPerTon: vary(params.miningOpexPerTon),
      initialCapex: vary(params.initialCapex),
    };
    const { npv } = calculateMineFinancials(simulatedParams);
    npvs.push(npv);
    if (npv < 0) losses++;
  }

  npvs.sort((a, b) => a - b);
  const minimum = npvs[0];
  const maximum = npvs[npvs.length - 1];
  // Give a constant distribution a nonzero range as well.
  const binWidth = maximum === minimum ? 1 : (maximum - minimum) / 20;
  const distributionHistogram = Array.from({ length: 20 }, (_, index) => ({
    bin: `${minimum + index * binWidth} – ${minimum + (index + 1) * binWidth}`,
    count: 0,
  }));
  for (const npv of npvs) {
    const index = Math.min(19, Math.floor((npv - minimum) / binWidth));
    distributionHistogram[index].count++;
  }

  const result: MonteCarloResult = {
    p10NPV: percentile(npvs, 0.1),
    p50NPV: percentile(npvs, 0.5),
    p90NPV: percentile(npvs, 0.9),
    lossProbability: losses / iterations * 100,
    distributionHistogram,
  };
  self.postMessage(result);
};
