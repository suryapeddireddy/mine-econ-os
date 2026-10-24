'use client';

import {
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AnnualCashFlow } from '@/types/economics';

interface CashFlowChartProps {
  annualLedger: AnnualCashFlow[];
}

const moneyInMillions = (value: number) =>
  `$${(value / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;

function CashFlowTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label === 0 ? 'Year 0 · Initial CAPEX' : `Year ${label}`}</strong>
      {payload.map(item => (
        <p key={item.dataKey}>
          <span>{item.dataKey === 'netFreeCashFlow' ? 'Net free cash flow' : 'Cumulative NPV'}</span>
          <b>{moneyInMillions(item.value)}</b>
        </p>
      ))}
    </div>
  );
}

export default function CashFlowChart({ annualLedger }: CashFlowChartProps) {
  return (
    <section className="analytics-card cash-flow-chart" aria-labelledby="cash-flow-chart-title">
      <div className="analytics-heading">
        <div>
          <p className="eyebrow">LIFE-OF-MINE ANALYSIS</p>
          <h2 id="cash-flow-chart-title">Cash flow &amp; cumulative NPV</h2>
        </div>
        <div className="chart-legend" aria-label="Chart series">
          <span><i className="legend-bar" />Annual net free cash flow</span>
          <span><i className="legend-line" />Cumulative discounted cash flow</span>
        </div>
      </div>
      <div className="analytics-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={annualLedger} margin={{ top: 16, right: 18, bottom: 4, left: 8 }}>
            <CartesianGrid stroke="#1d2938" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#65748a"
              tick={{ fill: '#99a8bd', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#293647' }}
              label={{ value: 'Year', position: 'insideBottom', offset: -2, fill: '#8290a6', fontSize: 10 }}
            />
            <YAxis
              yAxisId="cash"
              stroke="#65748a"
              tick={{ fill: '#99a8bd', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `$${(Number(value) / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 0 })}M`}
              width={58}
            />
            <Tooltip content={<CashFlowTooltip />} />
            <Bar yAxisId="cash" dataKey="netFreeCashFlow" fill="#22d3ee" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
            <Line
              yAxisId="cash"
              type="monotone"
              dataKey="cumulativeNPV"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#fbbf24', stroke: '#0b0f19', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Year 0 is initial investment. Values shown in USD millions.</p>
    </section>
  );
}
