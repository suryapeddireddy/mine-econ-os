'use client';

import { useId } from 'react';

interface SliderGroupProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (val: number) => void;
  description?: string;
}

export default function SliderGroup({ label, value, min, max, step, unit, onChange, description }: SliderGroupProps) {
  const id = useId();
  return (
    <div className="slider-group">
      <div className="slider-label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="value-badge">{value.toLocaleString('en-US', { maximumFractionDigits: 3 })} <span>{unit}</span></output>
      </div>
      <input id={id} type="range" aria-label={label} aria-describedby={description ? `${id}-description` : undefined}
        aria-valuetext={`${value} ${unit}`} min={min} max={max} step={step} value={value}
        onChange={event => onChange(Number(event.target.value))} />
      {description && <p id={`${id}-description`} className="slider-description">{description}</p>}
    </div>
  );
}
