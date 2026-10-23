'use client';

import { Coins, Gem, Pickaxe, TrendingUp } from 'lucide-react';
import SliderGroup from '@/components/controls/SliderGroup';
import type { MineParameters } from '@/types/economics';

interface ControlDeckProps {
  params: MineParameters;
  onChange: (updatedParams: MineParameters) => void;
}

const sections = [
  { title: 'Geology & Production', icon: Gem, fields: [
    { key: 'totalTonnage', label: 'Ore reserve', min: 1, max: 200, step: 1, unit: 'Mt', description: 'In-situ reserve before mining recovery.' },
    { key: 'annualMiningCapacity', label: 'Annual capacity', min: 0.5, max: 20, step: 0.5, unit: 'Mt/y' },
    { key: 'headGrade', label: 'Head grade', min: 0.1, max: 100, step: 0.1, unit: '%' },
  ] },
  { title: 'CAPEX & OPEX', icon: Pickaxe, fields: [
    { key: 'initialCapex', label: 'Initial capital', min: 0, max: 1000, step: 5, unit: '$M' },
    { key: 'miningOpexPerTon', label: 'Mining cost', min: 0, max: 100, step: 0.5, unit: '$/t' },
    { key: 'processingOpexPerTon', label: 'Processing cost', min: 0, max: 100, step: 0.5, unit: '$/t' },
  ] },
  { title: 'Market & IBM Royalties', icon: TrendingUp, fields: [
    { key: 'commodityPrice', label: 'Commodity price', min: 0, max: 15000, step: 10, unit: '$/t', description: 'Sale price per tonne of final metal.' },
    { key: 'discountRate', label: 'Discount rate', min: 0, max: 30, step: 0.5, unit: '%' },
    { key: 'royaltyRate', label: 'IBM royalty rate', min: 0, max: 30, step: 0.1, unit: '%', description: 'Applied to recovered feed at the preset IBM benchmark price.' },
  ] },
  { title: 'Hoskold Parameters', icon: Coins, fields: [
    { key: 'speculativeRate', label: 'Speculative rate · r₁', min: 0, max: 30, step: 0.5, unit: '%' },
    { key: 'sinkingFundRate', label: 'Sinking fund rate · r₂', min: 0, max: 15, step: 0.5, unit: '%' },
  ] },
] as const;

export default function ControlDeck({ params, onChange }: ControlDeckProps) {
  return (
    <aside className="control-deck panel" aria-label="Mine parameter controls">
      <div className="panel-heading"><span className="eyebrow">MODEL INPUTS</span><span className="live-dot">Live</span></div>
      {sections.map(({ title, icon: Icon, fields }) => (
        <section className="control-section" key={title}>
          <h2><Icon size={16} aria-hidden="true" />{title}</h2>
          {fields.map(({ key, ...field }) => <SliderGroup key={key} {...field} value={params[key]}
            onChange={value => onChange({ ...params, [key]: value })} />)}
        </section>
      ))}
      <p className="control-note">Recovery, tax, transport and sustaining capital use the selected preset assumptions.</p>
    </aside>
  );
}
