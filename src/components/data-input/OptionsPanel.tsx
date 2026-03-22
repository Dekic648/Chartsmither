import React, { useState } from 'react';
import type { ChartOptions, ReferenceLine } from '../../types/chart';
import { BRAND_THEMES, getBrandTheme } from '../../theme/brands';

interface OptionsPanelProps {
  options: ChartOptions;
  onChange: (options: ChartOptions) => void;
}

const Y_FORMATS: { value: ChartOptions['yAxisFormat']; label: string }[] = [
  { value: 'number', label: 'Number (1,234)' },
  { value: 'percent', label: 'Percent (12.3%)' },
  { value: 'currency', label: 'Currency ($1,234)' },
  { value: 'compact', label: 'Compact (1.2K)' },
];

// ── Styles ──────────────────────────────────────────

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
  } as React.CSSProperties,
  sectionHeader: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    color: '#7A7468',
    margin: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 0',
    userSelect: 'none' as const,
  } as React.CSSProperties,
  sectionContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    paddingTop: '4px',
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
  inputSmall: {
    padding: '6px 8px',
    fontSize: '12px',
    border: '1px solid #E8E0D4',
    borderRadius: '4px',
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
  selectSmall: {
    padding: '6px 8px',
    fontSize: '12px',
    border: '1px solid #E8E0D4',
    borderRadius: '4px',
    background: '#FEFCF9',
    color: '#2D2A26',
    outline: 'none',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
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
    margin: '8px 0',
  },
  row: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  miniBtn: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 600 as const,
    border: '1px solid #E8E0D4',
    borderRadius: '4px',
    background: '#FFFFFF',
    color: '#2D2A26',
    cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  miniBtnDanger: {
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 600 as const,
    border: '1px solid #FECACA',
    borderRadius: '4px',
    background: '#FEF2F2',
    color: '#B91C1C',
    cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  refLineCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    padding: '8px 10px',
    background: '#FAF4EA',
    borderRadius: '5px',
    border: '1px solid #EDE7DD',
  },
};

// ── Reusable components ──────────────────────────────

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

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div style={s.sectionHeader} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{ fontSize: 10, color: '#9B9488' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div style={s.sectionContent}>{children}</div>}
    </div>
  );
}

// ── Main component ──────────────────────────────────

export default function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const update = <K extends keyof ChartOptions>(key: K, value: ChartOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const currentTheme = getBrandTheme(options.brandTheme ?? 'economist');
  const colors = options.colorOverrides.length
    ? options.colorOverrides
    : currentTheme.colors.palette.slice(0, 8);

  const handleColorChange = (index: number, newColor: string) => {
    const next = [...colors];
    next[index] = newColor;
    update('colorOverrides', next);
  };

  const addReferenceLine = () => {
    if ((options.referenceLines ?? []).length >= 3) return;
    const newLine: ReferenceLine = { axis: 'y', value: 0, label: '', color: '#9B9488', dashed: true };
    update('referenceLines', [...(options.referenceLines ?? []), newLine]);
  };

  const updateReferenceLine = (index: number, patch: Partial<ReferenceLine>) => {
    const lines = [...(options.referenceLines ?? [])];
    lines[index] = { ...lines[index], ...patch };
    update('referenceLines', lines);
  };

  const removeReferenceLine = (index: number) => {
    update('referenceLines', (options.referenceLines ?? []).filter((_, i) => i !== index));
  };

  return (
    <div style={s.panel}>
      <p style={s.header}>Options</p>

      {/* ── Text fields ────────────────────────────── */}
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

      <div style={s.group}>
        <label style={s.label}>Footnote</label>
        <input
          style={s.input}
          type="text"
          value={options.footnote ?? ''}
          onChange={(e) => update('footnote', e.target.value)}
          placeholder="Optional note or methodology"
        />
      </div>

      <hr style={s.divider} />

      {/* ── Theme picker ───────────────────────────── */}
      <div style={s.group}>
        <label style={s.label}>Theme</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BRAND_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                onChange({
                  ...options,
                  brandTheme: theme.id,
                  colorOverrides: theme.colors.palette.slice(0, 8),
                });
              }}
              style={{
                padding: '5px 10px',
                fontSize: 11,
                fontWeight: (options.brandTheme ?? 'economist') === theme.id ? 700 : 500,
                border: (options.brandTheme ?? 'economist') === theme.id
                  ? `2px solid ${theme.masthead.background}`
                  : '1px solid #E8E0D4',
                borderRadius: 5,
                background: (options.brandTheme ?? 'economist') === theme.id ? `${theme.masthead.background}10` : '#fff',
                color: '#2D2A26',
                cursor: 'pointer',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: theme.masthead.background, flexShrink: 0,
              }} />
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <hr style={s.divider} />

      {/* ── Y-axis format ──────────────────────────── */}
      <div style={s.group}>
        <label style={s.label}>Y-axis format</label>
        <select
          style={s.select}
          value={options.yAxisFormat}
          onChange={(e) => update('yAxisFormat', e.target.value as ChartOptions['yAxisFormat'])}
        >
          {Y_FORMATS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <hr style={s.divider} />

      {/* ── Toggles ────────────────────────────────── */}
      <div style={s.toggleRow}>
        <span style={s.toggleLabel}>Show grid</span>
        <Toggle on={options.showGrid} onToggle={(v) => update('showGrid', v)} />
      </div>

      <div style={s.toggleRow}>
        <span style={s.toggleLabel}>Show data labels</span>
        <Toggle on={options.showDataLabels} onToggle={(v) => update('showDataLabels', v)} />
      </div>

      {options.showDataLabels && (
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Position</label>
            <select
              style={s.selectSmall}
              value={options.dataLabelPosition}
              onChange={(e) => update('dataLabelPosition', e.target.value as ChartOptions['dataLabelPosition'])}
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
            </select>
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Format</label>
            <select
              style={s.selectSmall}
              value={options.dataLabelFormat}
              onChange={(e) => update('dataLabelFormat', e.target.value as ChartOptions['dataLabelFormat'])}
            >
              <option value="value">Value</option>
              <option value="percent">Percent</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      )}

      {/* ── Legend ──────────────────────────────────── */}
      <div style={s.group}>
        <label style={s.label}>Legend</label>
        <select
          style={s.select}
          value={options.legendPosition ?? 'top'}
          onChange={(e) => update('legendPosition', e.target.value as ChartOptions['legendPosition'])}
        >
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="none">Hidden</option>
        </select>
      </div>

      <hr style={s.divider} />

      {/* ── Colours ────────────────────────────────── */}
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

      <hr style={s.divider} />

      {/* ── Reference Lines ────────────────────────── */}
      <Section title="Reference Lines (max 3)">
        {(options.referenceLines ?? []).map((ref, i) => (
          <div key={i} style={s.refLineCard}>
            <div style={s.row}>
              <div style={{ ...s.group, flex: 1 }}>
                <label style={s.label}>Value</label>
                <input
                  style={s.inputSmall}
                  type="number"
                  value={ref.value}
                  onChange={(e) => updateReferenceLine(i, { value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div style={{ ...s.group, flex: 2 }}>
                <label style={s.label}>Label</label>
                <input
                  style={s.inputSmall}
                  type="text"
                  value={ref.label}
                  onChange={(e) => updateReferenceLine(i, { label: e.target.value })}
                  placeholder="e.g. Industry avg"
                />
              </div>
            </div>
            <div style={s.row}>
              <div style={{ ...s.group, flex: 1 }}>
                <label style={s.label}>Axis</label>
                <select
                  style={s.selectSmall}
                  value={ref.axis}
                  onChange={(e) => updateReferenceLine(i, { axis: e.target.value as 'y' | 'x' })}
                >
                  <option value="y">Y</option>
                  <option value="x">X</option>
                </select>
              </div>
              <div style={{ ...s.group, flex: 1 }}>
                <label style={s.label}>Dashed</label>
                <Toggle on={ref.dashed} onToggle={(v) => updateReferenceLine(i, { dashed: v })} />
              </div>
              <button style={s.miniBtnDanger} onClick={() => removeReferenceLine(i)}>Remove</button>
            </div>
          </div>
        ))}
        {(options.referenceLines ?? []).length < 3 && (
          <button style={s.miniBtn} onClick={addReferenceLine}>+ Add reference line</button>
        )}
      </Section>

      <hr style={s.divider} />

      {/* ── Advanced ───────────────────────────────── */}
      <Section title="Advanced">
        {/* Dimensions */}
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Width</label>
            <input
              style={s.inputSmall}
              type="number"
              min={400}
              max={1200}
              step={10}
              value={options.width}
              onChange={(e) => update('width', Math.max(400, Math.min(1200, parseInt(e.target.value) || 620)))}
            />
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Height</label>
            <input
              style={s.inputSmall}
              type="number"
              min={250}
              max={800}
              step={10}
              value={options.height}
              onChange={(e) => update('height', Math.max(250, Math.min(800, parseInt(e.target.value) || 380)))}
            />
          </div>
        </div>

        {/* Axis range */}
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Y-axis min</label>
            <input
              style={s.inputSmall}
              type="number"
              value={options.yAxisMin ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                if (val != null && options.yAxisMax != null && val > options.yAxisMax) {
                  update('yAxisMin', options.yAxisMax);
                  update('yAxisMax', val);
                } else {
                  update('yAxisMin', val);
                }
              }}
              placeholder="Auto"
            />
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Y-axis max</label>
            <input
              style={s.inputSmall}
              type="number"
              value={options.yAxisMax ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseFloat(e.target.value);
                if (val != null && options.yAxisMin != null && val < options.yAxisMin) {
                  update('yAxisMax', options.yAxisMin);
                  update('yAxisMin', val);
                } else {
                  update('yAxisMax', val);
                }
              }}
              placeholder="Auto"
            />
          </div>
        </div>

        {/* Label rotation */}
        <div style={s.group}>
          <label style={s.label}>X-axis label rotation</label>
          <select
            style={s.selectSmall}
            value={options.xAxisLabelRotation ?? 0}
            onChange={(e) => update('xAxisLabelRotation', parseInt(e.target.value) as 0 | 45 | 90)}
          >
            <option value={0}>0° (horizontal)</option>
            <option value={45}>45° (angled)</option>
            <option value={90}>90° (vertical)</option>
          </select>
        </div>

        {/* Font sizes */}
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Title size</label>
            <input
              style={s.inputSmall}
              type="number"
              min={12}
              max={32}
              value={options.titleFontSize ?? 18}
              onChange={(e) => update('titleFontSize', Math.max(12, Math.min(32, parseInt(e.target.value) || 18)))}
            />
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Subtitle size</label>
            <input
              style={s.inputSmall}
              type="number"
              min={10}
              max={24}
              value={options.subtitleFontSize ?? 14}
              onChange={(e) => update('subtitleFontSize', Math.max(10, Math.min(24, parseInt(e.target.value) || 14)))}
            />
          </div>
        </div>

        {/* Number formatting */}
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Decimals</label>
            <input
              style={s.inputSmall}
              type="number"
              min={0}
              max={4}
              value={options.decimalPlaces ?? 0}
              onChange={(e) => update('decimalPlaces', Math.max(0, Math.min(4, parseInt(e.target.value) || 0)))}
            />
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Currency</label>
            <input
              style={s.inputSmall}
              type="text"
              value={options.currencySymbol ?? '$'}
              onChange={(e) => update('currencySymbol', e.target.value)}
              maxLength={3}
            />
          </div>
        </div>

        <div style={s.toggleRow}>
          <span style={{ ...s.toggleLabel, fontSize: 12 }}>Thousand separator</span>
          <Toggle on={options.thousandSeparator ?? true} onToggle={(v) => update('thousandSeparator', v)} />
        </div>

        {/* Line/point styling */}
        <div style={s.row}>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Line width</label>
            <input
              style={s.inputSmall}
              type="number"
              min={0.5}
              max={6}
              step={0.5}
              value={options.lineWidth ?? 2}
              onChange={(e) => update('lineWidth', Math.max(0.5, Math.min(6, parseFloat(e.target.value) || 2)))}
            />
          </div>
          <div style={{ ...s.group, flex: 1 }}>
            <label style={s.label}>Point size</label>
            <input
              style={s.inputSmall}
              type="number"
              min={0}
              max={8}
              step={0.5}
              value={options.pointSize ?? 3}
              onChange={(e) => update('pointSize', Math.max(0, Math.min(8, parseFloat(e.target.value) || 3)))}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
