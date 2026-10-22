import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'emerald' | 'amber' | 'crimson';
}

export default function KPICard({ title, value, unit, subtitle, icon: Icon, variant = 'cyan' }: KPICardProps) {
  return (
    <article className={`kpi-card kpi-${variant}`}>
      <div className="kpi-heading"><h2>{title}</h2><Icon size={18} aria-hidden="true" /></div>
      <p className="kpi-value">{value}{unit && <span>{unit}</span>}</p>
      {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
    </article>
  );
}
