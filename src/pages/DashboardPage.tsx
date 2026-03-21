import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { CHART_CATALOGUE, CHART_CATEGORIES } from '../types/catalogue';
import type { ChartTypeId } from '../types/chart';
import { DEFAULT_OPTIONS } from '../types/chart';
import type { DashboardPanel } from '../types/dashboard';
import { getSampleData } from '../utils/sampleData';
import { getColors } from '../theme/economist';
import ChartWrapper from '../components/layout/ChartWrapper';
import { CHARTJS_RENDERERS } from '../charts/chartjs';
import { SVG_RENDERERS } from '../charts/svg';
import { TIER2_BATCH1_RENDERERS } from '../charts/svg/tier2-batch1';
import { TIER2_BATCH2_RENDERERS } from '../charts/svg/tier2-batch2';
import { TIER2_BATCH3_RENDERERS } from '../charts/svg/tier2-batch3';
import { MAP_RENDERERS } from '../charts/maps';

// Merge all SVG renderers
const ALL_SVG_RENDERERS: Record<string, React.FC<any>> = {
  ...SVG_RENDERERS,
  ...TIER2_BATCH1_RENDERERS,
  ...TIER2_BATCH2_RENDERERS,
  ...TIER2_BATCH3_RENDERERS,
  ...MAP_RENDERERS,
};

const SIZE_COLS: Record<DashboardPanel['size'], number> = {
  small: 4,
  medium: 6,
  large: 12,
};

const SIZE_CYCLE: DashboardPanel['size'][] = ['small', 'medium', 'large'];

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getRenderer(chartType: ChartTypeId) {
  const meta = CHART_CATALOGUE.find((c) => c.id === chartType);
  if (!meta) return undefined;
  return meta.engine === 'chartjs'
    ? (CHARTJS_RENDERERS as Record<string, React.FC<any>>)[meta.id]
    : ALL_SVG_RENDERERS[meta.id];
}

function buildLegendItems(panel: DashboardPanel) {
  const { data } = panel;
  if (!data.series || data.series.length === 0) return [];
  const colors = getColors(data.series.length);
  return data.series.map((s, i) => ({
    label: s.name,
    color: s.color || colors[i],
  }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DashboardPage: React.FC = () => {
  const [title, setTitle] = useState('Untitled dashboard');
  const [panels, setPanels] = useState<DashboardPanel[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // ── Add chart ──────────────────────────────────────
  const addChart = useCallback((chartType: ChartTypeId) => {
    const meta = CHART_CATALOGUE.find((c) => c.id === chartType);
    if (!meta) return;
    const sampleData = getSampleData(chartType);
    const panel: DashboardPanel = {
      id: uid(),
      chartType,
      data: sampleData,
      options: {
        ...DEFAULT_OPTIONS,
        title: meta.name,
        subtitle: meta.description,
        width: 620,
        height: 380,
      },
      size: 'medium',
    };
    setPanels((prev) => [...prev, panel]);
    setDropdownOpen(false);
  }, []);

  // ── Delete panel ───────────────────────────────────
  const deletePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Toggle size ────────────────────────────────────
  const toggleSize = useCallback((id: string) => {
    setPanels((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = SIZE_CYCLE.indexOf(p.size);
        const next = SIZE_CYCLE[(idx + 1) % SIZE_CYCLE.length];
        return { ...p, size: next };
      }),
    );
  }, []);

  // ── Export PNG ─────────────────────────────────────
  const exportPng = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, {
        backgroundColor: '#FDF8F0',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `${title || 'dashboard'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed', err);
    }
  }, [title]);

  // ── Export HTML ────────────────────────────────────
  const exportHtml = useCallback(() => {
    if (!canvasRef.current) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title || 'Dashboard'}</title>
<style>
  body { margin: 0; padding: 40px; background: #FDF8F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
</style>
</head>
<body>
${canvasRef.current.outerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = `${title || 'dashboard'}.html`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [title]);

  // ── Grouped catalogue for dropdown ─────────────────
  const grouped = CHART_CATEGORIES.map((cat) => ({
    ...cat,
    charts: CHART_CATALOGUE.filter((c) => c.category === cat.id),
  })).filter((g) => g.charts.length > 0);

  // ── Render ─────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid #E8E0D4',
          flexWrap: 'wrap',
        }}
      >
        {/* Title input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#2D2A26',
            border: 'none',
            borderBottom: '2px solid transparent',
            background: 'transparent',
            outline: 'none',
            padding: '4px 0',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: '-0.02em',
            minWidth: 180,
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#E3120B'; }}
          onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
        />

        <div style={{ flex: 1 }} />

        {/* Add chart dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: '#FFFFFF',
              background: '#E3120B',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#C70F09'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#E3120B'; }}
          >
            + Add chart
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                width: 300,
                maxHeight: 420,
                overflowY: 'auto',
                background: '#FFFFFF',
                border: '1px solid #E8E0D4',
                borderRadius: 8,
                boxShadow: '0 8px 32px rgba(60, 45, 20, 0.12)',
                zIndex: 200,
                padding: '6px 0',
              }}
            >
              {grouped.map((group) => (
                <div key={group.id}>
                  <div
                    style={{
                      padding: '8px 14px 4px',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#9B9488',
                    }}
                  >
                    {group.label}
                  </div>
                  {group.charts.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => addChart(chart.id)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '7px 14px',
                        fontSize: 13,
                        color: '#2D2A26',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FDF8F0'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      <span style={{ marginRight: 8 }}>{chart.icon}</span>
                      {chart.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export buttons */}
        <button
          onClick={exportPng}
          disabled={panels.length === 0}
          style={{
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: panels.length === 0 ? '#C4BDB3' : '#2D2A26',
            background: '#FFFFFF',
            border: '1px solid #E8E0D4',
            borderRadius: 6,
            cursor: panels.length === 0 ? 'default' : 'pointer',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (panels.length > 0) {
              e.currentTarget.style.borderColor = '#9B9488';
              e.currentTarget.style.background = '#FAF4EA';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E8E0D4';
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          Export PNG
        </button>
        <button
          onClick={exportHtml}
          disabled={panels.length === 0}
          style={{
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: panels.length === 0 ? '#C4BDB3' : '#2D2A26',
            background: '#FFFFFF',
            border: '1px solid #E8E0D4',
            borderRadius: 6,
            cursor: panels.length === 0 ? 'default' : 'pointer',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (panels.length > 0) {
              e.currentTarget.style.borderColor = '#9B9488';
              e.currentTarget.style.background = '#FAF4EA';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E8E0D4';
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          Export HTML
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 20,
          minHeight: 400,
          padding: 24,
          background: '#FDF8F0',
          borderRadius: 10,
          border: '1px solid #E8E0D4',
        }}
      >
        {panels.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              color: '#9B9488',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>+</div>
            <div>Click <strong>"Add chart"</strong> to start building your dashboard</div>
          </div>
        )}

        {panels.map((panel) => {
          const meta = CHART_CATALOGUE.find((c) => c.id === panel.chartType);
          const Renderer = getRenderer(panel.chartType);
          const cols = SIZE_COLS[panel.size];
          const legendItems = panel.options.showLegend ? buildLegendItems(panel) : undefined;

          // Scale dimensions based on panel size
          const panelWidth = cols === 12 ? 1080 : cols === 6 ? 520 : 320;
          const panelHeight = cols === 12 ? 340 : 280;

          return (
            <div
              key={panel.id}
              style={{
                gridColumn: `span ${cols}`,
                background: '#FFFFFF',
                border: '1px solid #E8E0D4',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 1px 6px rgba(60, 45, 20, 0.04)',
              }}
            >
              {/* Panel toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  background: '#F8F4EE',
                  borderBottom: '1px solid #E8E0D4',
                  fontSize: 12,
                  color: '#9B9488',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                <span style={{ fontWeight: 600, color: '#6B665E' }}>
                  {meta?.icon} {meta?.name ?? panel.chartType}
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => toggleSize(panel.id)}
                  title={`Size: ${panel.size} — click to cycle`}
                  style={{
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9B9488',
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D4',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#9B9488';
                    e.currentTarget.style.color = '#2D2A26';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E0D4';
                    e.currentTarget.style.color = '#9B9488';
                  }}
                >
                  {panel.size === 'small' ? '4 col' : panel.size === 'medium' ? '6 col' : '12 col'}
                </button>
                <button
                  onClick={() => deletePanel(panel.id)}
                  title="Remove panel"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#C4BDB3',
                    background: 'none',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    lineHeight: 1,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#E3120B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#C4BDB3'; }}
                >
                  X
                </button>
              </div>

              {/* Chart content */}
              <div style={{ padding: 0 }}>
                <ChartWrapper
                  title={panel.options.title}
                  subtitle={panel.options.subtitle}
                  source={panel.options.source}
                  legendItems={legendItems}
                >
                  <div style={{ position: 'relative', height: panelHeight }}>
                    {Renderer ? (
                      <Renderer
                        data={panel.data}
                        options={panel.options}
                        width={panelWidth}
                        height={panelHeight}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#9B9488',
                          fontSize: 13,
                        }}
                      >
                        Renderer not available for "{panel.chartType}"
                      </div>
                    )}
                  </div>
                </ChartWrapper>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
