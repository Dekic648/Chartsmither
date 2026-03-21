import React from 'react';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
} from '../../theme/economist';
import type { ChartData, ChartOptions } from '../../types/chart';

// ---------------------------------------------------------------------------
// Shared types & helpers
// ---------------------------------------------------------------------------

export interface SVGChartProps {
  data: ChartData;
  options: ChartOptions;
  width?: number;
  height?: number;
}

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;

/** Resolve a color: use override if present, otherwise palette. */
function color(index: number, overrides: string[] = []): string {
  return overrides[index] ?? getColor(index);
}

/** Format a numeric value according to the axis format. */
function fmt(v: number, format: ChartOptions['yAxisFormat'] = 'number'): string {
  switch (format) {
    case 'percent':
      return `${(v * 100).toFixed(0)}%`;
    case 'currency':
      return v >= 1_000_000
        ? `$${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `$${(v / 1_000).toFixed(1)}K`
          : `$${v.toFixed(0)}`;
    case 'compact':
      return v >= 1_000_000
        ? `${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `${(v / 1_000).toFixed(1)}K`
          : String(Math.round(v));
    default:
      return Number.isInteger(v) ? String(v) : v.toFixed(1);
  }
}

/** Common text style props. */
const labelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 11,
  fill: C.textSecondary,
};

const titleStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: 16,
  fill: C.textPrimary,
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 400,
  fontSize: 12,
  fill: C.textSecondary,
};

const sourceStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 10,
  fill: C.textTertiary,
  fontStyle: 'italic',
};

// ---------------------------------------------------------------------------
// Header / Source helpers rendered inside each chart
// ---------------------------------------------------------------------------

interface HeaderMeta {
  headerH: number;
  sourceH: number;
}

function headerHeight(options: ChartOptions): HeaderMeta {
  let h = 0;
  if (options.title) h += 22;
  if (options.subtitle) h += 16;
  if (options.title || options.subtitle) h += 8; // gap
  const sourceH = options.source ? 18 : 0;
  return { headerH: h, sourceH };
}

function renderHeader(options: ChartOptions, width: number) {
  const els: React.ReactNode[] = [];
  let y = 16;
  if (options.title) {
    els.push(
      <text key="title" x={0} y={y} style={titleStyle}>
        {options.title}
      </text>,
    );
    y += 18;
  }
  if (options.subtitle) {
    els.push(
      <text key="subtitle" x={0} y={y} style={subtitleStyle}>
        {options.subtitle}
      </text>,
    );
  }
  // Red top rule (Economist signature)
  els.push(
    <line key="rule" x1={0} y1={0} x2={width} y2={0} stroke={C.red} strokeWidth={3} />,
  );
  return <g>{els}</g>;
}

function renderSource(options: ChartOptions, x: number, y: number) {
  if (!options.source) return null;
  return (
    <text x={x} y={y} style={sourceStyle}>
      Source: {options.source}
    </text>
  );
}

// ---------------------------------------------------------------------------
// 1. HeatmapChart
// ---------------------------------------------------------------------------

export const HeatmapChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const matrix = data.matrix;
  if (!matrix) return null;
  const { rows, cols, values } = matrix;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 28 + sourceH, left: 80 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const cellW = plotW / cols.length;
  const cellH = plotH / rows.length;

  const allVals = values.flat();
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  function cellColor(v: number): string {
    const t = (v - minV) / range;
    const r = Math.round(235 - t * (235 - 46));
    const g = Math.round(245 - t * (245 - 109));
    const b = Math.round(255 - t * (255 - 164));
    return `rgb(${r},${g},${b})`;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform={`translate(0,0)`}>{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {rows.map((_row, ri) =>
          cols.map((_, ci) => (
            <rect
              key={`${ri}-${ci}`}
              x={ci * cellW}
              y={ri * cellH}
              width={cellW - 1}
              height={cellH - 1}
              fill={cellColor(values[ri][ci])}
              rx={2}
            />
          )),
        )}
        {/* Value labels */}
        {rows.map((_, ri) =>
          cols.map((_, ci) => (
            <text
              key={`t-${ri}-${ci}`}
              x={ci * cellW + cellW / 2}
              y={ri * cellH + cellH / 2 + 4}
              textAnchor="middle"
              style={{ ...labelStyle, fontSize: Math.min(10, cellH * 0.4), fill: (values[ri][ci] - minV) / range > 0.6 ? '#fff' : C.textPrimary }}
            >
              {fmt(values[ri][ci], options.yAxisFormat)}
            </text>
          )),
        )}
        {/* Row labels */}
        {rows.map((row, ri) => (
          <text
            key={`r-${ri}`}
            x={-8}
            y={ri * cellH + cellH / 2 + 4}
            textAnchor="end"
            style={labelStyle}
          >
            {row}
          </text>
        ))}
        {/* Col labels */}
        {cols.map((col, ci) => (
          <text
            key={`c-${ci}`}
            x={ci * cellW + cellW / 2}
            y={plotH + 16}
            textAnchor="middle"
            style={labelStyle}
          >
            {col}
          </text>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. TreemapChart
// ---------------------------------------------------------------------------

interface TreeRect {
  label: string;
  value: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export const TreemapChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 8, bottom: 8 + sourceH, left: 8 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const colored = items.map((it, i) => ({
    label: it.label,
    value: it.value,
    color: color(i, options.colorOverrides),
  }));

  // Better squarify: recursively split
  function layoutSquarify(
    arr: typeof colored,
    x: number,
    y: number,
    w: number,
    h: number,
  ): TreeRect[] {
    if (arr.length === 0) return [];
    if (arr.length === 1)
      return [{ ...arr[0], x, y, w, h }];
    if (arr.length === 2) {
      const total = arr[0].value + arr[1].value;
      const ratio = arr[0].value / total;
      if (w >= h) {
        return [
          { ...arr[0], x, y, w: w * ratio, h },
          { ...arr[1], x: x + w * ratio, y, w: w * (1 - ratio), h },
        ];
      } else {
        return [
          { ...arr[0], x, y, w, h: h * ratio },
          { ...arr[1], x, y: y + h * ratio, w, h: h * (1 - ratio) },
        ];
      }
    }
    // Split into two groups trying to keep ratio close to 1
    const total = arr.reduce((s, d) => s + d.value, 0);
    let best = Infinity;
    let splitIdx = 1;
    let runSum = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      runSum += arr[i].value;
      const ratio = runSum / total;
      const aspect = Math.max(ratio / (1 - ratio), (1 - ratio) / ratio);
      if (aspect < best) {
        best = aspect;
        splitIdx = i + 1;
      }
    }
    const left = arr.slice(0, splitIdx);
    const right = arr.slice(splitIdx);
    const leftTotal = left.reduce((s, d) => s + d.value, 0);
    const ratio = leftTotal / total;
    if (w >= h) {
      return [
        ...layoutSquarify(left, x, y, w * ratio, h),
        ...layoutSquarify(right, x + w * ratio, y, w * (1 - ratio), h),
      ];
    } else {
      return [
        ...layoutSquarify(left, x, y, w, h * ratio),
        ...layoutSquarify(right, x, y + h * ratio, w, h * (1 - ratio)),
      ];
    }
  }

  const sorted = [...colored].sort((a, b) => b.value - a.value);
  const rects = layoutSquarify(sorted, 0, 0, plotW, plotH);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {rects.map((r, i) => (
          <g key={i}>
            <rect
              x={r.x + 1}
              y={r.y + 1}
              width={Math.max(0, r.w - 2)}
              height={Math.max(0, r.h - 2)}
              fill={r.color}
              rx={2}
            />
            {r.w > 40 && r.h > 24 && (
              <>
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 - 2}
                  textAnchor="middle"
                  style={{ fontFamily: FONT, fontSize: Math.min(12, r.w / 8), fill: '#fff', fontWeight: 600 }}
                >
                  {r.label}
                </text>
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + 12}
                  textAnchor="middle"
                  style={{ fontFamily: FONT, fontSize: Math.min(10, r.w / 10), fill: 'rgba(255,255,255,0.8)' }}
                >
                  {fmt(r.value, options.yAxisFormat)}
                </text>
              </>
            )}
          </g>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. LollipopChart (horizontal)
// ---------------------------------------------------------------------------

export const LollipopChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items ?? (data.labels ?? []).map((l, i) => ({
    label: l,
    value: data.series?.[0]?.data[i] ?? 0,
  }));
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => a.value - b.value);
  const { headerH, sourceH } = headerHeight(options);
  const maxLabel = Math.max(...sorted.map((d) => d.label.length)) * 7;
  const margin = { top: headerH + 8, right: 40, bottom: 16 + sourceH, left: Math.min(maxLabel, 140) };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const barH = Math.min(28, plotH / sorted.length);
  const gap = Math.max(4, (plotH - barH * sorted.length) / sorted.length);
  const maxVal = Math.max(...sorted.map((d) => d.value));
  const scale = plotW / (maxVal || 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Gridlines */}
        {options.showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={t * plotW}
              y1={0}
              x2={t * plotW}
              y2={sorted.length * (barH + gap) - gap}
              stroke={C.gridLine}
              strokeWidth={0.8}
            />
          ))}
        {sorted.map((item, i) => {
          const y = i * (barH + gap) + barH / 2;
          const xEnd = item.value * scale;
          return (
            <g key={i}>
              <text x={-10} y={y + 4} textAnchor="end" style={labelStyle}>
                {item.label}
              </text>
              <line x1={0} y1={y} x2={xEnd} y2={y} stroke={C.palette[0]} strokeWidth={2} />
              <circle cx={xEnd} cy={y} r={5} fill={C.palette[0]} />
              <text x={xEnd + 10} y={y + 4} style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}>
                {fmt(item.value, options.yAxisFormat)}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. DivergingBarChart
// ---------------------------------------------------------------------------

export const DivergingBarChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as { label: string; value: number; left?: number; right?: number }[] | undefined;
  if (!items || items.length === 0) return null;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 40, bottom: 20 + sourceH, left: 100 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const barH = Math.min(24, (plotH / items.length) * 0.7);
  const gap = (plotH - barH * items.length) / items.length;

  const lefts = items.map((d) => (d.left as number) ?? 0);
  const rights = items.map((d) => (d.right as number) ?? 0);
  const maxVal = Math.max(...lefts, ...rights, 1);
  const halfW = plotW / 2;
  const scale = halfW / maxVal;
  const leftColor = color(0, options.colorOverrides);
  const rightColor = color(1, options.colorOverrides);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Center line */}
        <line x1={halfW} y1={0} x2={halfW} y2={plotH} stroke={C.axis} strokeWidth={1} />
        {items.map((item, i) => {
          const y = i * (barH + gap) + gap / 2;
          const lv = (item.left as number) ?? 0;
          const rv = (item.right as number) ?? 0;
          return (
            <g key={i}>
              <text x={halfW} y={y + barH / 2 + 4} textAnchor="middle" style={{ ...labelStyle, fontSize: 10 }}>
                {/* label placed to the far left */}
              </text>
              <text x={-8} y={y + barH / 2 + 4} textAnchor="end" style={labelStyle}>
                {item.label}
              </text>
              {/* Left bar */}
              <rect
                x={halfW - lv * scale}
                y={y}
                width={lv * scale}
                height={barH}
                fill={leftColor}
                rx={2}
              />
              {/* Right bar */}
              <rect x={halfW} y={y} width={rv * scale} height={barH} fill={rightColor} rx={2} />
              {/* Values */}
              <text x={halfW - lv * scale - 4} y={y + barH / 2 + 4} textAnchor="end" style={{ ...labelStyle, fontSize: 9 }}>
                {fmt(lv, options.yAxisFormat)}
              </text>
              <text x={halfW + rv * scale + 4} y={y + barH / 2 + 4} textAnchor="start" style={{ ...labelStyle, fontSize: 9 }}>
                {fmt(rv, options.yAxisFormat)}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 5. PopulationPyramidChart
// ---------------------------------------------------------------------------

export const PopulationPyramidChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as { label: string; value: number; left?: number; right?: number }[] | undefined;
  if (!items || items.length === 0) return null;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 30, bottom: 24 + sourceH, left: 30 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const labelW = 50;
  const halfW = (plotW - labelW) / 2;
  const barH = Math.min(20, (plotH / items.length) * 0.8);
  const gap = (plotH - barH * items.length) / items.length;

  const lefts = items.map((d) => (d.left as number) ?? 0);
  const rights = items.map((d) => (d.right as number) ?? 0);
  const maxVal = Math.max(...lefts, ...rights, 1);
  const scale = halfW / maxVal;

  const maleColor = '#2E6DA4';
  const femaleColor = '#C0392B';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {items.map((item, i) => {
          const y = i * (barH + gap) + gap / 2;
          const lv = (item.left as number) ?? 0;
          const rv = (item.right as number) ?? 0;
          const centerX = halfW;
          return (
            <g key={i}>
              {/* Male (left) */}
              <rect
                x={centerX - lv * scale}
                y={y}
                width={lv * scale}
                height={barH}
                fill={maleColor}
                rx={1}
              />
              {/* Label */}
              <text
                x={centerX + labelW / 2}
                y={y + barH / 2 + 4}
                textAnchor="middle"
                style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}
              >
                {item.label}
              </text>
              {/* Female (right) */}
              <rect
                x={centerX + labelW}
                y={y}
                width={rv * scale}
                height={barH}
                fill={femaleColor}
                rx={1}
              />
            </g>
          );
        })}
        {/* Legend */}
        {options.showLegend && (
          <g transform={`translate(0, ${plotH + 8})`}>
            <rect x={0} y={0} width={10} height={10} fill={maleColor} rx={1} />
            <text x={14} y={9} style={{ ...labelStyle, fontSize: 10 }}>Male</text>
            <rect x={60} y={0} width={10} height={10} fill={femaleColor} rx={1} />
            <text x={74} y={9} style={{ ...labelStyle, fontSize: 10 }}>Female</text>
          </g>
        )}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 6. BulletGraphChart
// ---------------------------------------------------------------------------

export const BulletGraphChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  // items: { label, value, target?, ranges?: [poor, ok, good] }
  const items = data.items as {
    label: string;
    value: number;
    target?: number;
    ranges?: number[];
  }[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 24, bottom: 20 + sourceH, left: 100 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const rowH = Math.min(50, plotH / items.length);
  const barH = rowH * 0.35;

  const rangeColors = ['#ddd', '#bbb', '#999'];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {items.map((item, i) => {
          const ranges = (item.ranges as number[]) ?? [item.value * 0.5, item.value * 0.75, item.value * 1.2];
          const maxVal = Math.max(...ranges, item.value, (item.target as number) ?? 0);
          const scale = plotW / (maxVal || 1);
          const cy = i * rowH + rowH / 2;
          return (
            <g key={i}>
              {/* Label */}
              <text x={-10} y={cy + 4} textAnchor="end" style={labelStyle}>
                {item.label}
              </text>
              {/* Range backgrounds */}
              {ranges.map((rv, ri) => (
                <rect
                  key={ri}
                  x={0}
                  y={cy - rowH * 0.35}
                  width={rv * scale}
                  height={rowH * 0.7}
                  fill={rangeColors[ri]}
                  rx={1}
                />
              )).reverse()}
              {/* Actual bar */}
              <rect
                x={0}
                y={cy - barH / 2}
                width={item.value * scale}
                height={barH}
                fill={C.palette[0]}
                rx={1}
              />
              {/* Target tick */}
              {item.target != null && (
                <line
                  x1={(item.target as number) * scale}
                  y1={cy - rowH * 0.35}
                  x2={(item.target as number) * scale}
                  y2={cy + rowH * 0.35}
                  stroke={C.textPrimary}
                  strokeWidth={2.5}
                />
              )}
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 7. BoxPlotChart
// ---------------------------------------------------------------------------

function calcBoxStats(arr: number[]): {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
} {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  const q = (p: number) => {
    const pos = p * (n - 1);
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return s[lo] + (s[hi] - s[lo]) * (pos - lo);
  };
  return { min: s[0], q1: q(0.25), median: q(0.5), q3: q(0.75), max: s[n - 1] };
}

export const BoxPlotChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 24, bottom: 36 + sourceH, left: 50 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Build stats from series (each series = one box) or items with pre-computed stats
  interface BoxData {
    label: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  }

  let boxes: BoxData[] = [];
  if (data.series && data.series.length > 0) {
    boxes = data.series.map((s) => ({
      label: s.name,
      ...calcBoxStats(s.data),
    }));
  } else if (data.items) {
    boxes = data.items.map((it) => ({
      label: it.label,
      min: (it.min as number) ?? 0,
      q1: (it.q1 as number) ?? 0,
      median: (it.median as number) ?? 0,
      q3: (it.q3 as number) ?? 0,
      max: (it.max as number) ?? 0,
    }));
  }
  if (boxes.length === 0) return null;

  const globalMin = Math.min(...boxes.map((b) => b.min));
  const globalMax = Math.max(...boxes.map((b) => b.max));
  const pad = (globalMax - globalMin) * 0.05 || 1;
  const yMin = globalMin - pad;
  const yMax = globalMax + pad;
  const yScale = plotH / (yMax - yMin);
  const toY = (v: number) => plotH - (v - yMin) * yScale;

  const boxW = Math.min(60, (plotW / boxes.length) * 0.6);
  const step = plotW / boxes.length;

  // Y gridlines
  const ticks = 5;
  const tickStep = (yMax - yMin) / ticks;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Gridlines */}
        {options.showGrid &&
          Array.from({ length: ticks + 1 }, (_, i) => {
            const v = yMin + i * tickStep;
            return (
              <g key={i}>
                <line x1={0} y1={toY(v)} x2={plotW} y2={toY(v)} stroke={C.gridLine} strokeWidth={0.8} />
                <text x={-8} y={toY(v) + 4} textAnchor="end" style={labelStyle}>
                  {fmt(v, options.yAxisFormat)}
                </text>
              </g>
            );
          })}
        {boxes.map((b, i) => {
          const cx = step * i + step / 2;
          return (
            <g key={i}>
              {/* Whiskers */}
              <line x1={cx} y1={toY(b.min)} x2={cx} y2={toY(b.q1)} stroke={C.textSecondary} strokeWidth={1} />
              <line x1={cx} y1={toY(b.q3)} x2={cx} y2={toY(b.max)} stroke={C.textSecondary} strokeWidth={1} />
              {/* Min/max caps */}
              <line x1={cx - boxW * 0.2} y1={toY(b.min)} x2={cx + boxW * 0.2} y2={toY(b.min)} stroke={C.textSecondary} strokeWidth={1} />
              <line x1={cx - boxW * 0.2} y1={toY(b.max)} x2={cx + boxW * 0.2} y2={toY(b.max)} stroke={C.textSecondary} strokeWidth={1} />
              {/* Box */}
              <rect
                x={cx - boxW / 2}
                y={toY(b.q3)}
                width={boxW}
                height={toY(b.q1) - toY(b.q3)}
                fill={color(i, options.colorOverrides)}
                opacity={0.8}
                rx={2}
              />
              {/* Median */}
              <line
                x1={cx - boxW / 2}
                y1={toY(b.median)}
                x2={cx + boxW / 2}
                y2={toY(b.median)}
                stroke="#fff"
                strokeWidth={2}
              />
              {/* Label */}
              <text x={cx} y={plotH + 16} textAnchor="middle" style={labelStyle}>
                {b.label}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 8. ViolinPlotChart
// ---------------------------------------------------------------------------

function gaussianKDE(data: number[], bandwidth: number, nSamples: number = 20): { x: number; y: number }[] {
  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const pad = (max - min) * 0.1 || 1;
  const step = (max - min + 2 * pad) / (nSamples - 1);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < nSamples; i++) {
    const x = min - pad + i * step;
    let density = 0;
    for (const d of data) {
      const u = (x - d) / bandwidth;
      density += Math.exp(-0.5 * u * u) / (bandwidth * Math.sqrt(2 * Math.PI));
    }
    density /= data.length;
    points.push({ x, y: density });
  }
  return points;
}

export const ViolinPlotChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 24, bottom: 36 + sourceH, left: 50 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Each series = one violin
  const series = data.series ?? [];
  if (series.length === 0) return null;

  const allValues = series.flatMap((s) => s.data);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const pad = (globalMax - globalMin) * 0.05 || 1;
  const yMin = globalMin - pad;
  const yMax = globalMax + pad;
  const yScale = plotH / (yMax - yMin);
  const toY = (v: number) => plotH - (v - yMin) * yScale;

  const step = plotW / series.length;
  const maxHalfW = step * 0.4;

  // Compute KDE for all, find global max density for scaling
  const kdes = series.map((s) => {
    const bw = (globalMax - globalMin) / 8 || 1;
    return gaussianKDE(s.data, bw, 24);
  });
  const globalMaxDensity = Math.max(...kdes.flatMap((k) => k.map((p) => p.y)), 1e-10);
  const densityScale = maxHalfW / globalMaxDensity;

  const ticks = 5;
  const tickStep = (yMax - yMin) / ticks;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {options.showGrid &&
          Array.from({ length: ticks + 1 }, (_, i) => {
            const v = yMin + i * tickStep;
            return (
              <g key={i}>
                <line x1={0} y1={toY(v)} x2={plotW} y2={toY(v)} stroke={C.gridLine} strokeWidth={0.8} />
                <text x={-8} y={toY(v) + 4} textAnchor="end" style={labelStyle}>
                  {fmt(v, options.yAxisFormat)}
                </text>
              </g>
            );
          })}
        {series.map((s, si) => {
          const cx = step * si + step / 2;
          const kde = kdes[si];
          // Build mirrored path
          const rightPath = kde.map((p) => `${cx + p.y * densityScale},${toY(p.x)}`).join(' L');
          const leftPath = [...kde].reverse().map((p) => `${cx - p.y * densityScale},${toY(p.x)}`).join(' L');
          const d = `M ${rightPath} L ${leftPath} Z`;
          return (
            <g key={si}>
              <path d={d} fill={color(si, options.colorOverrides)} opacity={0.7} />
              <path d={d} fill="none" stroke={color(si, options.colorOverrides)} strokeWidth={1} />
              {/* Median line */}
              {(() => {
                const stats = calcBoxStats(s.data);
                return (
                  <line
                    x1={cx - maxHalfW * 0.3}
                    y1={toY(stats.median)}
                    x2={cx + maxHalfW * 0.3}
                    y2={toY(stats.median)}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              })()}
              <text x={cx} y={plotH + 16} textAnchor="middle" style={labelStyle}>
                {s.name}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 9. DotMatrixChart
// ---------------------------------------------------------------------------

export const DotMatrixChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 36 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const total = items.reduce((s, d) => s + d.value, 0);
  const cols = 10;
  const rows = 10;
  const dotR = Math.min(plotW / (cols * 2.5), plotH / (rows * 2.5));
  const spacingX = plotW / cols;
  const spacingY = (plotH - 20) / rows; // leave room for legend

  // Build color map: which dot gets which color
  const dotColors: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const count = Math.round((items[i].value / total) * 100);
    for (let j = 0; j < count && dotColors.length < 100; j++) {
      dotColors.push(color(i, options.colorOverrides));
    }
  }
  while (dotColors.length < 100) dotColors.push(C.gridLine);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {Array.from({ length: 100 }, (_, idx) => {
          const row = Math.floor(idx / cols);
          const col = idx % cols;
          return (
            <circle
              key={idx}
              cx={col * spacingX + spacingX / 2}
              cy={row * spacingY + spacingY / 2}
              r={dotR}
              fill={dotColors[idx]}
            />
          );
        })}
        {/* Legend */}
        {options.showLegend && (
          <g transform={`translate(0, ${rows * spacingY + 6})`}>
            {items.map((it, i) => {
              const xOff = i * 100;
              return (
                <g key={i} transform={`translate(${xOff}, 0)`}>
                  <circle cx={5} cy={5} r={5} fill={color(i, options.colorOverrides)} />
                  <text x={14} y={9} style={{ ...labelStyle, fontSize: 10 }}>
                    {it.label} ({Math.round((it.value / total) * 100)}%)
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 10. SpanChart
// ---------------------------------------------------------------------------

export const SpanChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as {
    label: string;
    value: number;
    min?: number;
    max?: number;
  }[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 30, bottom: 24 + sourceH, left: 100 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const rowH = Math.min(28, plotH / items.length);
  const gap = (plotH - rowH * items.length) / items.length;

  const allVals = items.flatMap((d) => [
    (d.min as number) ?? d.value,
    (d.max as number) ?? d.value,
    d.value,
  ]);
  const globalMin = Math.min(...allVals);
  const globalMax = Math.max(...allVals);
  const range = globalMax - globalMin || 1;
  const toX = (v: number) => ((v - globalMin) / range) * plotW;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {options.showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={t * plotW}
              y1={0}
              x2={t * plotW}
              y2={items.length * (rowH + gap)}
              stroke={C.gridLine}
              strokeWidth={0.8}
            />
          ))}
        {items.map((item, i) => {
          const y = i * (rowH + gap) + rowH / 2;
          const minV = (item.min as number) ?? item.value;
          const maxV = (item.max as number) ?? item.value;
          return (
            <g key={i}>
              <text x={-10} y={y + 4} textAnchor="end" style={labelStyle}>
                {item.label}
              </text>
              {/* Range line */}
              <line
                x1={toX(minV)}
                y1={y}
                x2={toX(maxV)}
                y2={y}
                stroke={C.palette[0]}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Min/max caps */}
              <circle cx={toX(minV)} cy={y} r={3} fill={C.palette[0]} />
              <circle cx={toX(maxV)} cy={y} r={3} fill={C.palette[0]} />
              {/* Value dot */}
              <circle cx={toX(item.value)} cy={y} r={5} fill={C.red} />
            </g>
          );
        })}
        {/* Axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <text
            key={t}
            x={t * plotW}
            y={items.length * (rowH + gap) + 14}
            textAnchor="middle"
            style={labelStyle}
          >
            {fmt(globalMin + t * range, options.yAxisFormat)}
          </text>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 11. WaterfallChart
// ---------------------------------------------------------------------------

export const WaterfallChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as {
    label: string;
    value: number;
    type?: 'increase' | 'decrease' | 'total';
  }[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 24, bottom: 44 + sourceH, left: 50 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Compute running total and bar positions
  interface WBar {
    label: string;
    start: number;
    end: number;
    type: string;
  }
  const bars: WBar[] = [];
  let running = 0;
  for (const item of items) {
    const t = (item.type as string) ?? (item.value >= 0 ? 'increase' : 'decrease');
    if (t === 'total') {
      bars.push({ label: item.label, start: 0, end: running, type: 'total' });
    } else {
      const start = running;
      running += item.value;
      bars.push({ label: item.label, start, end: running, type: item.value >= 0 ? 'increase' : 'decrease' });
    }
  }

  const allVals = bars.flatMap((b) => [b.start, b.end]);
  const yMin = Math.min(0, ...allVals);
  const yMax = Math.max(0, ...allVals);
  const yRange = yMax - yMin || 1;
  const yPad = yRange * 0.1;
  const scaleY = plotH / (yRange + 2 * yPad);
  const toY = (v: number) => (yMax + yPad - v) * scaleY;

  const barW = Math.min(50, (plotW / bars.length) * 0.65);
  const step = plotW / bars.length;

  const colorMap: Record<string, string> = {
    increase: C.positive,
    decrease: C.negative,
    total: C.palette[0],
  };

  const ticks = 5;
  const tickStep = (yRange + 2 * yPad) / ticks;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Gridlines */}
        {options.showGrid &&
          Array.from({ length: ticks + 1 }, (_, i) => {
            const v = yMin - yPad + i * tickStep;
            return (
              <g key={i}>
                <line x1={0} y1={toY(v)} x2={plotW} y2={toY(v)} stroke={C.gridLine} strokeWidth={0.8} />
                <text x={-8} y={toY(v) + 4} textAnchor="end" style={labelStyle}>
                  {fmt(v, options.yAxisFormat)}
                </text>
              </g>
            );
          })}
        {/* Zero line */}
        <line x1={0} y1={toY(0)} x2={plotW} y2={toY(0)} stroke={C.axis} strokeWidth={1} />
        {bars.map((b, i) => {
          const cx = step * i + step / 2;
          const top = Math.min(toY(b.start), toY(b.end));
          const bottom = Math.max(toY(b.start), toY(b.end));
          const barHeight = Math.max(1, bottom - top);
          return (
            <g key={i}>
              <rect
                x={cx - barW / 2}
                y={top}
                width={barW}
                height={barHeight}
                fill={colorMap[b.type]}
                rx={2}
              />
              {/* Value label */}
              <text
                x={cx}
                y={top - 6}
                textAnchor="middle"
                style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}
              >
                {fmt(b.end - b.start, options.yAxisFormat)}
              </text>
              {/* Connector line to next bar */}
              {i < bars.length - 1 && (
                <line
                  x1={cx + barW / 2}
                  y1={toY(b.end)}
                  x2={step * (i + 1) + step / 2 - barW / 2}
                  y2={toY(b.end)}
                  stroke={C.border}
                  strokeWidth={1}
                  strokeDasharray="3,2"
                />
              )}
              {/* X label */}
              <text x={cx} y={plotH + 14} textAnchor="middle" style={{ ...labelStyle, fontSize: 10 }}>
                {b.label}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 12. RadialBarChart
// ---------------------------------------------------------------------------

export const RadialBarChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, bottom: 30 + sourceH };
  const plotH = H - margin.top - margin.bottom;
  const cx = W / 2;
  const cy = margin.top + plotH / 2;
  const maxR = Math.min(plotH, W - 40) / 2;
  const maxVal = Math.max(...items.map((d) => d.value), 1);

  const trackW = Math.min(18, (maxR * 0.7) / items.length);
  const gap = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      {items.map((item, i) => {
        const r = maxR - i * (trackW + gap);
        if (r <= 0) return null;
        const angle = (item.value / maxVal) * 360;
        const rad = (angle * Math.PI) / 180;
        const largeArc = angle > 180 ? 1 : 0;
        const x2 = cx + r * Math.sin(rad);
        const y2 = cy - r * Math.cos(rad);
        const arcPath =
          angle >= 360
            ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`
            : `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
        return (
          <g key={i}>
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.gridLine} strokeWidth={trackW} />
            {/* Arc */}
            <path
              d={arcPath}
              fill="none"
              stroke={color(i, options.colorOverrides)}
              strokeWidth={trackW}
              strokeLinecap="round"
            />
            {/* Label */}
            <text
              x={cx - maxR - 8}
              y={cy - r + 4}
              textAnchor="end"
              style={{ ...labelStyle, fontSize: 10 }}
            >
              {item.label}
            </text>
          </g>
        );
      })}
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 13. NightingaleRoseChart
// ---------------------------------------------------------------------------

export const NightingaleRoseChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items ?? (data.labels ?? []).map((l, i) => ({
    label: l,
    value: data.series?.[0]?.data[i] ?? 0,
  }));
  if (items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, bottom: 20 + sourceH };
  const plotH = H - margin.top - margin.bottom;
  const cx = W / 2;
  const cy = margin.top + plotH / 2;
  const maxR = Math.min(plotH, W - 40) / 2 - 10;
  const maxVal = Math.max(...items.map((d) => d.value), 1);
  const n = items.length;
  const angleStep = (2 * Math.PI) / n;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      {/* Guide circles */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <circle
          key={t}
          cx={cx}
          cy={cy}
          r={maxR * t}
          fill="none"
          stroke={C.gridLineFaint}
          strokeWidth={0.5}
        />
      ))}
      {items.map((item, i) => {
        const r = (item.value / maxVal) * maxR;
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = startAngle + angleStep;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = angleStep > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        // Label position
        const midAngle = startAngle + angleStep / 2;
        const labelR = maxR + 14;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);
        return (
          <g key={i}>
            <path d={d} fill={color(i, options.colorOverrides)} opacity={0.85} stroke="#fff" strokeWidth={1} />
            <text
              x={lx}
              y={ly + 3}
              textAnchor={midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? 'end' : 'start'}
              style={{ ...labelStyle, fontSize: 9 }}
            >
              {item.label}
            </text>
          </g>
        );
      })}
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 14. ProportionalAreaChart
// ---------------------------------------------------------------------------

export const ProportionalAreaChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 16, bottom: 30 + sourceH, left: 16, right: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const maxVal = Math.max(...items.map((d) => d.value), 1);
  const maxR = Math.min(plotH / 2 - 12, plotW / (items.length * 2));

  // Area proportional: r = maxR * sqrt(value / maxVal)
  const circles = items.map((it, i) => ({
    ...it,
    r: maxR * Math.sqrt(it.value / maxVal),
    color: color(i, options.colorOverrides),
  }));

  const totalDiameter = circles.reduce((s, c) => s + c.r * 2, 0) + (circles.length - 1) * 12;
  const startX = (plotW - totalDiameter) / 2;
  let cx = startX;
  const cy = margin.top + plotH / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left}, 0)`}>
        {circles.map((c, i) => {
          const thisCx = cx + c.r;
          cx += c.r * 2 + 12;
          return (
            <g key={i}>
              <circle cx={thisCx} cy={cy} r={c.r} fill={c.color} opacity={0.85} />
              <text x={thisCx} y={cy + 4} textAnchor="middle" style={{ fontFamily: FONT, fontSize: Math.min(11, c.r * 0.6), fill: '#fff', fontWeight: 600 }}>
                {fmt(c.value, options.yAxisFormat)}
              </text>
              <text x={thisCx} y={cy + c.r + 16} textAnchor="middle" style={labelStyle}>
                {c.label}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 15. PictogramChart
// ---------------------------------------------------------------------------

// Simple person icon path (16x16 viewBox)
const PERSON_PATH =
  'M8 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-5 8c0-1 1-2 2.5-2h5c1.5 0 2.5 1 2.5 2v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z';

export const PictogramChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 12 + sourceH, left: 100 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const maxVal = Math.max(...items.map((d) => d.value), 1);
  const iconSize = Math.min(18, plotW / (maxVal + 1), (plotH / items.length) * 0.7);
  const rowH = Math.max(iconSize + 4, plotH / items.length);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {items.map((item, i) => {
          const y = i * rowH;
          const count = Math.round(item.value);
          const c = color(i, options.colorOverrides);
          return (
            <g key={i}>
              <text x={-10} y={y + iconSize / 2 + 4} textAnchor="end" style={labelStyle}>
                {item.label}
              </text>
              {Array.from({ length: count }, (_, j) => (
                <g key={j} transform={`translate(${j * (iconSize + 2)}, ${y})`}>
                  <svg width={iconSize} height={iconSize} viewBox="0 0 16 16">
                    <path d={PERSON_PATH} fill={c} />
                  </svg>
                </g>
              ))}
              <text
                x={count * (iconSize + 2) + 6}
                y={y + iconSize / 2 + 4}
                style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}
              >
                {fmt(item.value, options.yAxisFormat)}
              </text>
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 16. WordCloudChart
// ---------------------------------------------------------------------------

export const WordCloudChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as { label: string; value: number; text?: string; weight?: number }[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, bottom: 12 + sourceH, left: 16, right: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const words = items.map((it) => ({
    text: (it.text as string) ?? it.label,
    weight: (it.weight as number) ?? it.value,
  }));

  const maxWeight = Math.max(...words.map((w) => w.weight), 1);
  const minWeight = Math.min(...words.map((w) => w.weight));
  const minFontSize = 10;
  const maxFontSize = 36;

  // Sort descending by weight for placement priority
  const sorted = [...words]
    .map((w, i) => ({ ...w, idx: i }))
    .sort((a, b) => b.weight - a.weight);

  // Simple spiral placement with collision detection
  interface Placed {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  const placed: Placed[] = [];

  function collides(rect: Placed): boolean {
    for (const p of placed) {
      if (
        rect.x < p.x + p.w &&
        rect.x + rect.w > p.x &&
        rect.y < p.y + p.h &&
        rect.y + rect.h > p.y
      )
        return true;
    }
    return false;
  }

  const positions: { x: number; y: number; size: number; text: string; color: string }[] = [];

  for (const word of sorted) {
    const t = maxWeight === minWeight ? 1 : (word.weight - minWeight) / (maxWeight - minWeight);
    const fontSize = minFontSize + t * (maxFontSize - minFontSize);
    const estW = word.text.length * fontSize * 0.6;
    const estH = fontSize * 1.2;

    let foundSpot = false;
    // Spiral outward from center
    for (let step = 0; step < 300 && !foundSpot; step++) {
      const angle = step * 0.3;
      const radius = step * 1.5;
      const x = plotW / 2 + radius * Math.cos(angle) - estW / 2;
      const y = plotH / 2 + radius * Math.sin(angle) - estH / 2;

      const rect = { x, y, w: estW, h: estH };
      if (x >= 0 && y >= 0 && x + estW <= plotW && y + estH <= plotH && !collides(rect)) {
        placed.push(rect);
        positions.push({
          x: x + estW / 2,
          y: y + estH * 0.75,
          size: fontSize,
          text: word.text,
          color: color(word.idx, options.colorOverrides),
        });
        foundSpot = true;
      }
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {positions.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            style={{
              fontFamily: FONT,
              fontSize: p.size,
              fontWeight: p.size > 20 ? 700 : 400,
              fill: p.color,
            }}
          >
            {p.text}
          </text>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// SVG_RENDERERS mapping
// ---------------------------------------------------------------------------

export const SVG_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  heatmap: HeatmapChart,
  treemap: TreemapChart,
  lollipop: LollipopChart,
  'diverging-bar': DivergingBarChart,
  'population-pyramid': PopulationPyramidChart,
  'bullet-graph': BulletGraphChart,
  'box-plot': BoxPlotChart,
  'violin-plot': ViolinPlotChart,
  'dot-matrix': DotMatrixChart,
  'span-chart': SpanChart,
  waterfall: WaterfallChart,
  'radial-bar': RadialBarChart,
  'nightingale-rose': NightingaleRoseChart,
  'proportional-area': ProportionalAreaChart,
  pictogram: PictogramChart,
  'word-cloud': WordCloudChart,
};
