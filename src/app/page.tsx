'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, BookOpen, Clock3, Coins, Layers3, Pickaxe, TrendingUp, Wallet } from 'lucide-react';
import ControlDeck from '@/components/controls/ControlDeck';
import KPICard from '@/components/ui/KPICard';
import { calculateMineFinancials } from '@/lib/calculations';
import { DEFAULT_PRESETS } from '@/lib/presets';
import type { MineParameters } from '@/types/economics';

const decimal = (value: number, digits = 1) => value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const millions = (value: number) => decimal(value / 1_000_000, 2);

export default function Dashboard() {
  const [params, setParams] = useState<MineParameters>({ ...DEFAULT_PRESETS[0].params });
  const [presetId, setPresetId] = useState<string | null>(DEFAULT_PRESETS[0].id);
  const results = useMemo(() => calculateMineFinancials(params), [params]);
  const life = params.totalTonnage / params.annualMiningCapacity;

  function updateParams(updated: MineParameters) {
    setParams(updated);
    setPresetId(null);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#command-deck">Skip to Command Deck</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="MineEcon-OS home"><span className="brand-icon"><Pickaxe size={23} /></span><span>MineEcon<span className="brand-os">-OS</span><small>MINERAL ECONOMICS WORKSPACE</small></span></Link>
        <nav aria-label="Main navigation"><a href="#command-deck" className="nav-active"><Activity size={15} />Command Deck</a><a href="#cash-flow"><Layers3 size={15} />Cash Flow Ledger</a></nav>
        <span className="system-status"><span />MODEL ONLINE</span>
      </header>

      <main id="command-deck" className="workspace" tabIndex={-1}>
        <div className="workspace-title"><div><p className="eyebrow">PROJECT VALUATION / WORKSPACE 01</p><h1>Command Deck<span>.</span></h1><p className="intro">Explore the economics beneath the surface.</p></div><div className="workspace-tag"><Activity size={15} />Deterministic analysis</div></div>

        <section className="preset-bar" aria-label="Benchmark scenarios"><span className="eyebrow">LOAD BENCHMARK</span><div className="preset-options">{DEFAULT_PRESETS.map(preset => <button key={preset.id} type="button" aria-pressed={presetId === preset.id} title={preset.description} className={`preset-button ${presetId === preset.id ? 'selected' : ''}`} onClick={() => { setParams({ ...preset.params }); setPresetId(preset.id); }}><span className="preset-category">{preset.category === 'GATE_SAMPLE' ? 'GATE' : 'INDIA'}</span>{preset.title}<ArrowUpRight size={14} aria-hidden="true" /></button>)}</div></section>

        <div className="dashboard-grid">
          <ControlDeck params={params} onChange={updateParams} />
          <div className="results-deck">
            <div className="model-heading"><div><span className="eyebrow">{presetId ? 'BENCHMARK SCENARIO' : 'CUSTOM SCENARIO'}</span><h2>{params.name}</h2></div><span className="life-badge">{decimal(life)} year mine life</span></div>
            <section className="kpi-grid" aria-label="Financial performance metrics">
              <KPICard title="Net Present Value" value={millions(results.npv)} unit="$M" subtitle={`DCF at ${params.discountRate}%`} icon={Wallet} variant={results.npv < 0 ? 'crimson' : 'cyan'} />
              <KPICard title="Internal Rate of Return" value={Number.isFinite(results.irr) ? decimal(results.irr) : 'N/A'} unit={Number.isFinite(results.irr) ? '%' : undefined} subtitle={Number.isFinite(results.irr) ? 'Annual project return' : 'No unique IRR'} icon={TrendingUp} variant="emerald" />
              <KPICard title="Payback Period" value={Number.isFinite(results.paybackPeriod) ? decimal(results.paybackPeriod) : 'Not repaid'} unit={Number.isFinite(results.paybackPeriod) ? 'yr' : undefined} subtitle="Undiscounted cash flows" icon={Clock3} variant="amber" />
              <KPICard title="Hoskold Value" value={millions(results.hoskoldValue)} unit="$M" subtitle="Before initial capital" icon={Coins} variant="cyan" />
              <KPICard title="All-in Sustaining Cost" value={Number.isFinite(results.aiscPerUnit) ? decimal(results.aiscPerUnit) : 'N/A'} unit={Number.isFinite(results.aiscPerUnit) ? '$/t' : undefined} subtitle="Per tonne of final metal" icon={Pickaxe} variant="amber" />
            </section>

            <section className="formula-banner" aria-labelledby="formula-title"><div className="formula-icon"><BookOpen size={21} /></div><div><p className="eyebrow">GATE FORMULA REFERENCE</p><h2 id="formula-title">Hoskold’s two-rate valuation</h2><p className="formula">V = A / [r₁ + r₂ / ((1 + r₂)ⁿ − 1)]</p><p>A = average annual operating free cash flow · n = mine life · rates expressed as decimals.</p><p className="formula-note">At r₂ = 0, the sinking fund factor is 1/n.</p></div><div className="formula-rates"><span>r₁ <strong>{params.speculativeRate}%</strong></span><span>r₂ <strong>{params.sinkingFundRate}%</strong></span></div></section>

            <section id="cash-flow" className="ledger panel" aria-labelledby="ledger-title">
              <div className="ledger-heading"><div><p className="eyebrow">LIFE-OF-MINE ANALYSIS</p><h2 id="ledger-title">Cash flow ledger</h2></div><span className="table-unit">All monetary values in USD millions</span></div>
              <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable life-of-mine cash flow table"><table><caption className="sr-only">Annual cash flows for {params.name}. Monetary amounts in USD millions; ore mined in million tonnes.</caption><thead><tr><th scope="col">Year</th><th scope="col">Ore mined (Mt)</th><th scope="col">Revenue</th><th scope="col">Mining</th><th scope="col">Processing</th><th scope="col">Royalties</th><th scope="col">Tax</th><th scope="col">Free cash flow</th><th scope="col">Discounted FCF</th><th scope="col">Cumulative NPV</th></tr></thead><tbody>{results.annualLedger.map(row => <tr key={row.year}><th scope="row">{row.year === 0 ? '00 · CAPEX' : String(row.year).padStart(2, '0')}</th><td>{decimal(row.oreMined / 1_000_000, 2)}</td><td>{millions(row.grossRevenue)}</td><td>{millions(row.miningCost)}</td><td>{millions(row.processingCost)}</td><td>{millions(row.royaltiesPaid)}</td><td>{millions(row.taxPaid)}</td><td className={row.netFreeCashFlow < 0 ? 'negative' : 'positive'}>{millions(row.netFreeCashFlow)}</td><td>{millions(row.discountedCashFlow)}</td><td className={row.cumulativeNPV < 0 ? 'negative' : 'positive'}>{millions(row.cumulativeNPV)}</td></tr>)}</tbody></table></div>
              <p className="ledger-note">Year 0 records initial investment. Free cash flow includes transport and sustaining capital; final partial years are booked at year end.</p>
            </section>
            <footer className="workspace-footer"><span>MineEcon-OS / Valuation engine</span><span>USD · End-of-year cash flows · Unlevered model</span></footer>
          </div>
        </div>
      </main>
    </div>
  );
}
