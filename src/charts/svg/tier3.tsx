import React from 'react';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
  getColors,
} from '../../theme/economist';
import type { ChartData, ChartOptions } from '../../types/chart';

export interface SVGChartProps {
  data: ChartData;
  options: ChartOptions;
  width?: number;
  height?: number;
}

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;

function color(index: number, overrides: string[] = []): string {
  return overrides[index] ?? getColor(index);
}

function fmt(v: number, format: ChartOptions['yAxisFormat'] = 'number'): string {
  switch (format) {
    case 'percent': return `${v}%`;
    case 'currency': return `$${v.toLocaleString()}`;
    case 'compact':
      if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
      if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
      return String(Math.round(v));
    default: return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }
}

const labelStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 11, fill: C.textSecondary };

// ---------------------------------------------------------------------------
// 1. SlopeChart
// ---------------------------------------------------------------------------

export const SlopeChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const labels = data.labels ?? [];
  const series = data.series ?? [];
  if (labels.length < 2 || series.length === 0) return null;

  const margin = { top: 32, right: 100, bottom: 24, left: 100 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const colors = getColors(series.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Column headers */}
        <text x={0} y={-12} textAnchor="middle" style={{ ...labelStyle, fontWeight: 700, fontSize: 12, fill: C.textPrimary }}>{labels[0]}</text>
        <text x={plotW} y={-12} textAnchor="middle" style={{ ...labelStyle, fontWeight: 700, fontSize: 12, fill: C.textPrimary }}>{labels[labels.length - 1]}</text>

        {/* Vertical lines */}
        <line x1={0} y1={0} x2={0} y2={plotH} stroke={C.gridLine} strokeWidth={1} />
        <line x1={plotW} y1={0} x2={plotW} y2={plotH} stroke={C.gridLine} strokeWidth={1} />

        {/* Slopes */}
        {series.map((s, i) => {
          const yStart = (s.data[0] - 1) / Math.max(series.length - 1, 1) * plotH;
          const yEnd = (s.data[s.data.length - 1] - 1) / Math.max(series.length - 1, 1) * plotH;
          const c = options.colorOverrides?.[i] ?? colors[i];
          return (
            <g key={i}>
              <line x1={0} y1={yStart} x2={plotW} y2={yEnd} stroke={c} strokeWidth={2.5} />
              <circle cx={0} cy={yStart} r={4} fill={c} />
              <circle cx={plotW} cy={yEnd} r={4} fill={c} />
              <text x={-8} y={yStart + 4} textAnchor="end" style={{ ...labelStyle, fontSize: 11, fill: c }}>{s.name}</text>
              <text x={plotW + 8} y={yEnd + 4} textAnchor="start" style={{ ...labelStyle, fontSize: 11, fill: c }}>{s.name}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. DumbbellChart
// ---------------------------------------------------------------------------

export const DumbbellChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const labels = data.labels ?? [];
  const series = data.series ?? [];
  if (labels.length === 0 || series.length < 2) return null;

  const maxLabel = Math.max(...labels.map((l) => l.length)) * 7;
  const margin = { top: 24, right: 40, bottom: 16, left: Math.min(maxLabel, 120) };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const barH = Math.min(24, plotH / labels.length * 0.6);
  const gap = (plotH - barH * labels.length) / labels.length;

  const allVals = series.flatMap((s) => s.data);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;
  const scale = (v: number) => ((v - minVal) / range) * plotW;

  const c1 = color(0, options.colorOverrides);
  const c2 = color(1, options.colorOverrides);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Legend */}
        <g transform={`translate(0, -10)`}>
          <circle cx={0} cy={0} r={4} fill={c1} /><text x={8} y={4} style={{ ...labelStyle, fontSize: 10 }}>{series[0].name}</text>
          <circle cx={80} cy={0} r={4} fill={c2} /><text x={88} y={4} style={{ ...labelStyle, fontSize: 10 }}>{series[1].name}</text>
        </g>

        {labels.map((label, i) => {
          const y = i * (barH + gap) + barH / 2;
          const x1 = scale(series[0].data[i]);
          const x2 = scale(series[1].data[i]);
          return (
            <g key={i}>
              <text x={-8} y={y + 4} textAnchor="end" style={labelStyle}>{label}</text>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.gridLine} strokeWidth={2} />
              <circle cx={x1} cy={y} r={5} fill={c1} />
              <circle cx={x2} cy={y} r={5} fill={c2} />
              {options.showDataLabels && (
                <>
                  <text x={Math.min(x1, x2) - 8} y={y + 4} textAnchor="end" style={{ ...labelStyle, fontSize: 9, fill: C.textPrimary }}>{fmt(series[0].data[i], options.yAxisFormat)}</text>
                  <text x={Math.max(x1, x2) + 8} y={y + 4} textAnchor="start" style={{ ...labelStyle, fontSize: 9, fill: C.textPrimary }}>{fmt(series[1].data[i], options.yAxisFormat)}</text>
                </>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. WaffleChart
// ---------------------------------------------------------------------------

export const WaffleChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const total = items.reduce((s, it) => s + it.value, 0);
  const gridSize = 10; // 10x10 = 100 squares
  const margin = { top: 16, right: 16, bottom: 40, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const cellW = plotW / gridSize;
  const cellH = Math.min(cellW, plotH / gridSize);
  const gap = 2;

  // Build color grid
  const grid: string[] = [];
  let remaining = 100;
  items.forEach((item, idx) => {
    const count = idx === items.length - 1 ? remaining : Math.round((item.value / total) * 100);
    for (let j = 0; j < count && grid.length < 100; j++) {
      grid.push(color(idx, options.colorOverrides));
    }
    remaining -= count;
  });
  while (grid.length < 100) grid.push(C.gridLine);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {grid.map((c, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          return (
            <rect
              key={i}
              x={col * cellW + gap / 2}
              y={row * cellH + gap / 2}
              width={cellW - gap}
              height={cellH - gap}
              fill={c}
              rx={2}
            />
          );
        })}
      </g>
      {/* Legend */}
      <g transform={`translate(${margin.left}, ${H - 20})`}>
        {items.map((item, i) => {
          const xOff = items.slice(0, i).reduce((s, it) => s + it.label.length * 7 + 24, 0);
          return (
            <g key={i} transform={`translate(${xOff}, 0)`}>
              <rect x={0} y={-4} width={10} height={10} fill={color(i, options.colorOverrides)} rx={2} />
              <text x={14} y={5} style={{ ...labelStyle, fontSize: 10 }}>{item.label} ({Math.round((item.value / total) * 100)}%)</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. BumpChart
// ---------------------------------------------------------------------------

export const BumpChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const labels = data.labels ?? [];
  const series = data.series ?? [];
  if (labels.length === 0 || series.length === 0) return null;

  const margin = { top: 24, right: 80, bottom: 32, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const maxRank = Math.max(...series.flatMap((s) => s.data));
  const colors = getColors(series.length);
  const xStep = plotW / (labels.length - 1);
  const yScale = (rank: number) => ((rank - 1) / (maxRank - 1)) * plotH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X-axis labels */}
        {labels.map((l, i) => (
          <text key={i} x={i * xStep} y={plotH + 18} textAnchor="middle" style={{ ...labelStyle, fontSize: 10 }}>{l}</text>
        ))}

        {/* Bump lines */}
        {series.map((s, si) => {
          const c = options.colorOverrides?.[si] ?? colors[si];
          const points = s.data.map((rank, i) => ({ x: i * xStep, y: yScale(rank) }));
          // Smooth curve
          let d = `M${points[0].x},${points[0].y}`;
          for (let i = 1; i < points.length; i++) {
            const cx = (points[i - 1].x + points[i].x) / 2;
            d += ` C${cx},${points[i - 1].y} ${cx},${points[i].y} ${points[i].x},${points[i].y}`;
          }
          return (
            <g key={si}>
              <path d={d} fill="none" stroke={c} strokeWidth={2.5} />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill={c} />
              ))}
              {/* Label at end */}
              <text x={points[points.length - 1].x + 8} y={points[points.length - 1].y + 4} style={{ ...labelStyle, fontSize: 11, fill: c, fontWeight: 600 }}>
                {s.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 5. SmallMultiples
// ---------------------------------------------------------------------------

export const SmallMultiplesChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const labels = data.labels ?? [];
  const series = data.series ?? [];
  if (labels.length === 0 || series.length === 0) return null;

  const cols = Math.ceil(Math.sqrt(series.length));
  const rows = Math.ceil(series.length / cols);
  const cellW = W / cols;
  const cellH = H / rows;
  const pad = 8;
  const maxVal = Math.max(...series.flatMap((s) => s.data));
  const colors = getColors(series.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {series.map((s, si) => {
        const col = si % cols;
        const row = Math.floor(si / cols);
        const ox = col * cellW + pad;
        const oy = row * cellH + pad;
        const pw = cellW - pad * 2;
        const ph = cellH - pad * 2 - 16; // room for title
        const c = options.colorOverrides?.[si] ?? colors[si];
        const barW = pw / labels.length * 0.7;
        const barGap = pw / labels.length;

        return (
          <g key={si} transform={`translate(${ox},${oy})`}>
            {/* Title */}
            <text x={0} y={12} style={{ ...labelStyle, fontSize: 11, fontWeight: 600, fill: C.textPrimary }}>{s.name}</text>
            {/* Border */}
            <rect x={0} y={16} width={pw} height={ph} fill="none" stroke={C.gridLine} strokeWidth={0.5} rx={2} />
            {/* Bars */}
            {s.data.map((v, i) => {
              const barH = (v / maxVal) * (ph - 8);
              return (
                <rect
                  key={i}
                  x={i * barGap + (barGap - barW) / 2}
                  y={16 + ph - barH - 4}
                  width={barW}
                  height={barH}
                  fill={c}
                  rx={1}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 6. BeeswarmChart
// ---------------------------------------------------------------------------

export const BeeswarmChart: React.FC<SVGChartProps> = ({ data, options, width: W = options.width, height: H = options.height }) => {
  const raw = data.raw ?? [];
  if (raw.length === 0) return null;

  const margin = { top: 16, right: 24, bottom: 32, left: 24 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const minVal = Math.min(...raw);
  const maxVal = Math.max(...raw);
  const range = maxVal - minVal || 1;
  const r = Math.max(3, Math.min(6, 200 / raw.length));
  const mainColor = color(0, options.colorOverrides);

  // Scale value to x position
  const xScale = (v: number) => ((v - minVal) / range) * plotW;

  // Simple force separation: stack dots vertically to avoid overlap
  const sorted = [...raw].sort((a, b) => a - b);
  const points: { x: number; y: number; value: number }[] = [];
  const centerY = plotH / 2;

  for (const v of sorted) {
    const x = xScale(v);
    // Find vertical position that doesn't overlap
    let y = centerY;
    let placed = false;
    for (let offset = 0; offset <= plotH / 2; offset += r * 2 + 1) {
      for (const dir of [0, 1, -1]) {
        const testY = centerY + dir * offset;
        if (testY < 0 || testY > plotH) continue;
        const overlaps = points.some((p) => {
          const dx = p.x - x;
          const dy = p.y - testY;
          return Math.sqrt(dx * dx + dy * dy) < r * 2 + 1;
        });
        if (!overlaps) {
          y = testY;
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
    points.push({ x, y, value: v });
  }

  // Axis ticks
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => minVal + (range * i) / tickCount);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Axis line */}
        <line x1={0} y1={plotH + 8} x2={plotW} y2={plotH + 8} stroke={C.axis} strokeWidth={1} />

        {/* Ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={xScale(t)} y1={plotH + 4} x2={xScale(t)} y2={plotH + 12} stroke={C.axis} strokeWidth={1} />
            <text x={xScale(t)} y={plotH + 24} textAnchor="middle" style={{ ...labelStyle, fontSize: 10 }}>
              {fmt(t, options.yAxisFormat)}
            </text>
          </g>
        ))}

        {/* Grid lines */}
        {options.showGrid && ticks.map((t, i) => (
          <line key={`g${i}`} x1={xScale(t)} y1={0} x2={xScale(t)} y2={plotH} stroke={C.gridLine} strokeWidth={0.5} strokeDasharray="3,3" />
        ))}

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={r} fill={`${mainColor}CC`} stroke={mainColor} strokeWidth={0.5} />
        ))}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Renderer mapping
// ---------------------------------------------------------------------------

export const TIER3_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  'slope-chart': SlopeChart,
  'dumbbell-chart': DumbbellChart,
  'waffle-chart': WaffleChart,
  'bump-chart': BumpChart,
  'small-multiples': SmallMultiplesChart,
  beeswarm: BeeswarmChart,
};
