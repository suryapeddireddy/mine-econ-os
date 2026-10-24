'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculateMineFinancials } from '@/lib/calculations';
import type { MineParameters } from '@/types/economics';

interface SensitivityChartProps {
  params: MineParameters;
  baselineNPV: number;
}

const scenarios = [
  { key: 'commodityPrice', label: 'Commodity price' },
  { key: 'initialCapex', label: 'Initial CAPEX' },
  { key: 'miningOpexPerTon', label: 'Mining OPEX' },
  { key: 'headGrade', label: 'Head grade' },
] as const;

const moneyInMillions = (value: number) =>
  `$${(value / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;

function SensitivityTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map(item => (
        <p key={item.dataKey}>
          <span>{item.dataKey === 'lowerNPV' ? 'Input reduced by 10%' : 'Input increased by 10%'}</span>
          <b>{moneyInMillions(item.value)}</b>
        </p>
      ))}
    </div>
  );
}

export default function SensitivityChart({ params, baselineNPV }: SensitivityChartProps) {
  const data = scenarios.map(({ key, label }) => {
    const current = params[key];
    const lower = Math.max(0, current * 0.9);
    const upper = key === 'headGrade' ? Math.min(100, current * 1.1) : current * 1.1;
    return {
      parameter: label,
      lowerNPV: calculateMineFinancials({ ...params, [key]: lower }).npv,
      upperNPV: calculateMineFinancials({ ...params, [key]: upper }).npv,
    };
  });

  return (
    <section className="analytics-card" aria-labelledby="sensitivity-title">
      <div className="analytics-heading">
        <div>
          <p className="eyebrow">PARAMETER IMPACT</p>
          <h2 id="sensitivity-title">NPV sensitivity</h2>
        </div>
        <span className="chart-unit">USD millions</span>
      </div>
      <div className="chart-legend sensitivity-legend">
        <span><i className="legend-bar lower" />Input −10%</span>
        <span><i className="legend-bar" />Input +10%</span>
        <span><i className="legend-line" />Base case</span>
      </div>
      <div className="analytics-chart sensitivity-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, bottom: 4, left: 14 }}>
            <CartesianGrid stroke="#1d2938" strokeDasharray="3 5" horizontal={false} />
            <XAxis
              type="number"
              stroke="#65748a"
              tick={{ fill: '#99a8bd', fontSize: 9 }}
              tickLine={false}
              axisLine={{ stroke: '#293647' }}
              tickFormatter={value => `$${(Number(value) / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 0 })}M`}
            />
            <YAxis
              type="category"
              dataKey="parameter"
              stroke="#65748a"
              tick={{ fill: '#b8c7da', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={112}
            />
            <Tooltip content={<SensitivityTooltip />} />
            <ReferenceLine x={baselineNPV} stroke="#fbbf24" strokeDasharray="4 4" />
            <Bar dataKey="lowerNPV" fill="#8b9bb0" fillOpacity={0.8} radius={[0, 3, 3, 0]} />
            <Bar dataKey="upperNPV" fill="#22d3ee" fillOpacity={0.8} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-note">Each parameter changes independently by ±10%; all other assumptions are held constant.</p>
    </section>
  );
}
