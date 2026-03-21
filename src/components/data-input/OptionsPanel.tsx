import React from 'react';
import type { ChartOptions } from '../../types/chart';

interface OptionsPanelProps {
  options: ChartOptions;
  onChange: (options: ChartOptions) => void;
}

const ECONOMIST_PALETTE = [
  '#e3120b', '#0f5499', '#262a33', '#6b7d8a',
  '#f0810f', '#00857c', '#8b572a', '#a5526a',
];

const Y_FORMATS: { value: ChartOptions['yAxisFormat']; label: string }[] = [
  { value: 'number', label: 'Number (1,234)' },
  { value: 'percent', label: 'Percent (12.3%)' },
  { value: 'currency', label: 'Currency ($1,234)' },
  { value: 'compact', label: 'Compact (1.2K)' },
];

const s = {
  panel: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: '#FFFFFF',
    border: '1px solid #E8E0D4',
    borderRadius: '8px',
    padding: '18px',
    boxShadow: '0 1px 4px rgba(60, 45, 20, 0.04)',
  },
  header: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#1A1714',
    margin: '0 0 2px',
    paddingBottom: '10px',
    borderBottom: '1px solid #EDE7DD',
  },
  group: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 600 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#9B9488',
    margin: 0,
  },
  input: {
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #E8E0D4',
    borderRadius: '5px',
    background: '#FEFCF9',
    color: '#2D2A26',
    outline: 'none',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    padding: '8px 10px',
    fontSize: '13px',
    border: '1px solid #E8E0D4',
    borderRadius: '5px',
    background: '#FEFCF9',
    color: '#2D2A26',
    outline: 'none',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    width: '100%',
    boxSizing: 'border-box' as const,
    cursor: 'pointer',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 0',
  },
  toggleLabel: {
    fontSize: '13px',
    color: '#2D2A26',
  },
  toggle: {
    position: 'relative' as const,
    width: '36px',
    height: '20px',
    cursor: 'pointer',
  },
  toggleTrack: (on: boolean) => ({
    width: '36px',
    height: '20px',
    borderRadius: '10px',
    background: on ? '#E3120B' : '#C4BDB3',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  }),
  toggleThumb: (on: boolean) => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'transform 0.2s',
    transform: on ? 'translateX(16px)' : 'translateX(0)',
    boxShadow: '0 1px 3px rgba(60, 45, 20, 0.15)',
  }),
  colorsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  colorSwatch: (color: string) => ({
    width: '28px',
    height: '28px',
    borderRadius: '4px',
    background: color,
    border: '2px solid transparent',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),
  hiddenColorInput: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #EDE7DD',
    margin: '2px 0',
  },
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: (v: boolean) => void }) {
  return (
    <button
      type="button"
      style={s.toggleTrack(on)}
      onClick={() => onToggle(!on)}
      aria-pressed={on}
    >
      <div style={s.toggleThumb(on)} />
    </button>
  );
}

export default function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const update = <K extends keyof ChartOptions>(key: K, value: ChartOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const colors = options.colorOverrides.length
    ? options.colorOverrides
    : ECONOMIST_PALETTE;

  const handleColorChange = (index: number, newColor: string) => {
    const next = [...colors];
    next[index] = newColor;
    update('colorOverrides', next);
  };

  return (
    <div style={s.panel}>
      <p style={s.header as React.CSSProperties}>Options</p>
      {/* Text fields */}
      <div style={s.group}>
        <label style={s.label}>Title</label>
        <input
          style={s.input}
          type="text"
          value={options.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Chart title"
        />
      </div>

      <div style={s.group}>
        <label style={s.label}>Subtitle</label>
        <input
          style={s.input}
          type="text"
          value={options.subtitle}
          onChange={(e) => update('subtitle', e.target.value)}
          placeholder="Brief description or units"
        />
      </div>

      <div style={s.group}>
        <label style={s.label}>Source</label>
        <input
          style={s.input}
          type="text"
          value={options.source}
          onChange={(e) => update('source', e.target.value)}
          placeholder="e.g. World Bank; The Economist"
        />
      </div>

      <hr style={s.divider} />

      {/* Y-axis format */}
      <div style={s.group}>
        <label style={s.label}>Y-axis format</label>
        <select
          style={s.select}
          value={options.yAxisFormat}
          onChange={(e) => update('yAxisFormat', e.target.value as ChartOptions['yAxisFormat'])}
        >
          {Y_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <hr style={s.divider} />

      {/* Toggles */}
      <div style={s.toggleRow}>
        <span style={s.toggleLabel}>Show legend</span>
        <Toggle on={options.showLegend} onToggle={(v) => update('showLegend', v)} />
      </div>

      <div style={s.toggleRow}>
        <span style={s.toggleLabel}>Show grid</span>
        <Toggle on={options.showGrid} onToggle={(v) => update('showGrid', v)} />
      </div>

      <hr style={s.divider} />

      {/* Colour overrides */}
      <div style={s.group}>
        <label style={s.label}>Colours</label>
        <div style={s.colorsRow}>
          {colors.map((color, i) => (
            <div key={i} style={s.colorSwatch(color)}>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(i, e.target.value)}
                style={s.hiddenColorInput}
                title={`Colour ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
