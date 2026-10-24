'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonteCarloResult } from '@/types/economics';

interface MonteCarloChartProps {
  result: MonteCarloResult | null;
  isRunning: boolean;
  error: string | null;
  onRun: () => void;
}

const moneyInMillions = (value: number) =>
  `$${(value / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;

function HistogramTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { binStart: number; binEnd: number; count: number } }>;
}) {
  const bin = payload?.[0]?.payload;
  if (!active || !bin) return null;

  return (
    <div className="chart-tooltip">
      <strong>{moneyInMillions(bin.binStart)} to {moneyInMillions(bin.binEnd)}</strong>
      <p><span>Simulations</span><b>{bin.count.toLocaleString('en-US')}</b></p>
    </div>
  );
}

export default function MonteCarloChart({ result, isRunning, error, onRun }: MonteCarloChartProps) {
  const histogram = result?.distributionHistogram.map(({ bin, count }) => {
    const [start, end] = bin.split(' – ').map(Number);
    return { bin, binStart: start, binEnd: end, midpoint: (start + end) / 2, count };
  }).filter(item => Number.isFinite(item.midpoint)) ?? [];

  return (
    <section className="analytics-card" aria-labelledby="monte-carlo-title">
      <div className="analytics-heading">
        <div>
          <p className="eyebrow">STOCHASTIC RISK ANALYSIS</p>
          <h2 id="monte-carlo-title">Monte Carlo NPV distribution</h2>
        </div>
        <button className="chart-action" type="button" onClick={onRun} disabled={isRunning}>
          {isRunning ? 'Simulating…' : result ? 'Run again' : 'Run simulation'}
        </button>
      </div>

      <div className="risk-summary" aria-live="polite">
        <div className="loss-metric">
          <span>Probability of loss</span>
          <strong>{result ? `${result.lossProbability.toFixed(1)}%` : '—'}</strong>
        </div>
        <div><span>P10 NPV</span><strong>{result ? moneyInMillions(result.p10NPV) : '—'}</strong></div>
        <div><span>P50 · Median</span><strong>{result ? moneyInMillions(result.p50NPV) : '—'}</strong></div>
        <div><span>P90 NPV</span><strong>{result ? moneyInMillions(result.p90NPV) : '—'}</strong></div>
      </div>

      {error && <p className="chart-error" role="alert">{error}</p>}
      {result ? (
        <div className="analytics-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogram} margin={{ top: 30, right: 14, bottom: 4, left: 2 }}>
              <CartesianGrid stroke="#1d2938" strokeDasharray="3 5" vertical={false} />
              <XAxis
                type="number"
                dataKey="midpoint"
                domain={['dataMin', 'dataMax']}
                stroke="#65748a"
                tick={{ fill: '#99a8bd', fontSize: 9 }}
                tickLine={false}
                axisLine={{ stroke: '#293647' }}
                tickFormatter={value => moneyInMillions(Number(value))}
              />
              <YAxis
                type="number"
                dataKey="count"
                stroke="#65748a"
                tick={{ fill: '#99a8bd', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip content={<HistogramTooltip />} />
              <Bar dataKey="count" isAnimationActive={false} radius={[3, 3, 0, 0]}>
                {histogram.map((bin, index) => (
                  <Cell key={`${bin.bin}-${index}`} fill={bin.midpoint < 0 ? '#fb7185' : '#22d3ee'} fillOpacity={0.75} />
                ))}
              </Bar>
              {result && [
                { value: result.p10NPV, label: 'P10', color: '#fb7185' },
                { value: result.p50NPV, label: 'P50', color: '#fbbf24' },
                { value: result.p90NPV, label: 'P90', color: '#34d399' },
              ].map(({ value, label, color }) => (
                <ReferenceLine
                  key={label}
                  x={value}
                  stroke={color}
                  strokeDasharray="4 4"
                  label={{ value: label, position: 'insideTop', fill: color, fontSize: 9 }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-empty">{isRunning ? 'Running 10,000 scenarios…' : 'Run a simulation to explore NPV risk across 10,000 scenarios.'}</div>
      )}
    </section>
  );
}
