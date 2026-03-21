import React from 'react';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
} from '../../theme/economist';
import type { ChartOptions } from '../../types/chart';
import type { SVGChartProps } from './index';

// ---------------------------------------------------------------------------
// Shared constants & helpers (mirror index.tsx conventions)
// ---------------------------------------------------------------------------

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;

function color(index: number, overrides: string[] = []): string {
  return overrides[index] ?? getColor(index);
}

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
// Header / Source helpers
// ---------------------------------------------------------------------------

interface HeaderMeta {
  headerH: number;
  sourceH: number;
}

function headerHeight(options: ChartOptions): HeaderMeta {
  let h = 0;
  if (options.title) h += 22;
  if (options.subtitle) h += 16;
  if (options.title || options.subtitle) h += 8;
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
// 1. VennDiagramChart
// ---------------------------------------------------------------------------

export const VennDiagramChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 20 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const cx = plotW / 2;
  const cy = plotH / 2;

  // Separate circle items from overlap items
  const circleItems = items.filter(
    (it) => !String(it.label).toLowerCase().includes('overlap'),
  );
  const overlapItems = items.filter((it) =>
    String(it.label).toLowerCase().includes('overlap'),
  );
  const numCircles = Math.min(circleItems.length, 3);

  if (numCircles === 0) return null;

  const baseR = Math.min(plotW, plotH) * 0.28;
  const overlapDist = baseR * 0.7;

  // Position circles
  type Circle = { x: number; y: number; r: number; label: string; value: number; color: string };
  const circles: Circle[] = [];

  if (numCircles === 1) {
    circles.push({
      x: cx,
      y: cy,
      r: baseR,
      label: circleItems[0].label,
      value: circleItems[0].value,
      color: color(0, options.colorOverrides),
    });
  } else if (numCircles === 2) {
    circles.push({
      x: cx - overlapDist * 0.5,
      y: cy,
      r: baseR,
      label: circleItems[0].label,
      value: circleItems[0].value,
      color: color(0, options.colorOverrides),
    });
    circles.push({
      x: cx + overlapDist * 0.5,
      y: cy,
      r: baseR,
      label: circleItems[1].label,
      value: circleItems[1].value,
      color: color(1, options.colorOverrides),
    });
  } else {
    // 3 circles in a triangle arrangement
    const angleOffset = -Math.PI / 2;
    for (let i = 0; i < 3; i++) {
      const angle = angleOffset + (i * 2 * Math.PI) / 3;
      circles.push({
        x: cx + Math.cos(angle) * overlapDist * 0.55,
        y: cy + Math.sin(angle) * overlapDist * 0.55,
        r: baseR * 0.85,
        label: circleItems[i].label,
        value: circleItems[i].value,
        color: color(i, options.colorOverrides),
      });
    }
  }

  const overlapValue =
    overlapItems.length > 0
      ? fmt(overlapItems[0].value, options.yAxisFormat)
      : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <defs>
        {circles.map((_, i) => (
          <clipPath key={`clip-${i}`} id={`venn-clip-${i}`}>
            <circle cx={circles[i].x} cy={circles[i].y} r={circles[i].r} />
          </clipPath>
        ))}
      </defs>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Circles with semi-transparent fills */}
        {circles.map((c, i) => (
          <circle
            key={`circle-${i}`}
            cx={c.x}
            cy={c.y}
            r={c.r}
            fill={c.color}
            fillOpacity={0.25}
            stroke={c.color}
            strokeWidth={2}
          />
        ))}
        {/* Circle labels */}
        {circles.map((c, i) => {
          // Offset label away from center
          const dx = c.x - cx;
          const dy = c.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const labelOffset = c.r * 0.55;
          const lx = numCircles === 1 ? c.x : c.x + (dx / dist) * labelOffset;
          const ly = numCircles === 1 ? c.y - 8 : c.y + (dy / dist) * labelOffset;
          return (
            <g key={`label-${i}`}>
              <text
                x={lx}
                y={ly - 6}
                textAnchor="middle"
                style={{
                  fontFamily: FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  fill: C.textPrimary,
                }}
              >
                {c.label}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor="middle"
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fill: C.textSecondary,
                }}
              >
                {fmt(c.value, options.yAxisFormat)}
              </text>
            </g>
          );
        })}
        {/* Overlap label in center */}
        {overlapValue && (
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 700,
              fill: C.textPrimary,
            }}
          >
            {overlapValue}
          </text>
        )}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. DensityPlotChart
// ---------------------------------------------------------------------------

/** Gaussian kernel density estimation. */
function kernelDensity(
  data: number[],
  nPoints: number = 200,
  bandwidth?: number,
): { x: number; y: number }[] {
  if (data.length === 0) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const std = Math.sqrt(
    data.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(n - 1, 1),
  );

  // Silverman's rule of thumb
  const h =
    bandwidth ??
    0.9 * Math.min(std, (sorted[Math.floor(n * 0.75)] - sorted[Math.floor(n * 0.25)]) / 1.34 || std) *
      Math.pow(n, -0.2);

  const bw = Math.max(h, 1e-6);
  const xMin = sorted[0] - 3 * bw;
  const xMax = sorted[n - 1] + 3 * bw;
  const step = (xMax - xMin) / (nPoints - 1);

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < nPoints; i++) {
    const x = xMin + i * step;
    let density = 0;
    for (let j = 0; j < n; j++) {
      const u = (x - data[j]) / bw;
      density += Math.exp(-0.5 * u * u) / (bw * Math.sqrt(2 * Math.PI));
    }
    density /= n;
    points.push({ x, y: density });
  }
  return points;
}

export const DensityPlotChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  // Support both raw (single series) and series (multi)
  const seriesList: { name: string; data: number[] }[] = [];
  if (data.series && data.series.length > 0) {
    data.series.forEach((s) => seriesList.push({ name: s.name, data: s.data }));
  } else if (data.raw && data.raw.length > 0) {
    seriesList.push({ name: 'Distribution', data: data.raw });
  }

  if (seriesList.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 40 + sourceH, left: 50 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Compute density for each series
  const densities = seriesList.map((s) => kernelDensity(s.data));

  // Global x/y range
  let xMin = Infinity,
    xMax = -Infinity,
    yMax = 0;
  densities.forEach((pts) => {
    pts.forEach((p) => {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y > yMax) yMax = p.y;
    });
  });
  const xRange = xMax - xMin || 1;
  yMax *= 1.1; // headroom

  const scaleX = (v: number) => ((v - xMin) / xRange) * plotW;
  const scaleY = (v: number) => plotH - (v / yMax) * plotH;

  // Grid lines for y-axis
  const yTicks: number[] = [];
  const yStep = yMax / 4;
  for (let i = 0; i <= 4; i++) yTicks.push(i * yStep);

  // X-axis ticks
  const xTicks: number[] = [];
  const xStep = xRange / 5;
  for (let i = 0; i <= 5; i++) xTicks.push(xMin + i * xStep);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid lines */}
        {options.showGrid &&
          yTicks.map((t, i) => (
            <line
              key={`g-${i}`}
              x1={0}
              y1={scaleY(t)}
              x2={plotW}
              y2={scaleY(t)}
              stroke={C.gridLine}
              strokeWidth={0.8}
            />
          ))}

        {/* Density curves */}
        {densities.map((pts, si) => {
          const pathD =
            `M ${scaleX(pts[0].x)} ${scaleY(pts[0].y)}` +
            pts
              .slice(1)
              .map((p) => ` L ${scaleX(p.x)} ${scaleY(p.y)}`)
              .join('');
          const areaD = pathD + ` L ${scaleX(pts[pts.length - 1].x)} ${plotH} L ${scaleX(pts[0].x)} ${plotH} Z`;
          const c = color(si, options.colorOverrides);
          return (
            <g key={`s-${si}`}>
              <path d={areaD} fill={c} fillOpacity={0.2} />
              <path d={pathD} fill="none" stroke={c} strokeWidth={2} />
            </g>
          );
        })}

        {/* X axis */}
        <line x1={0} y1={plotH} x2={plotW} y2={plotH} stroke={C.axis} strokeWidth={0.8} />
        {xTicks.map((t, i) => (
          <text
            key={`xt-${i}`}
            x={scaleX(t)}
            y={plotH + 16}
            textAnchor="middle"
            style={labelStyle}
          >
            {fmt(t, options.yAxisFormat)}
          </text>
        ))}

        {/* Y axis ticks */}
        {yTicks.map((t, i) => (
          <text
            key={`yt-${i}`}
            x={-8}
            y={scaleY(t) + 4}
            textAnchor="end"
            style={labelStyle}
          >
            {t.toFixed(3)}
          </text>
        ))}

        {/* Axis labels */}
        {options.xAxisLabel && (
          <text
            x={plotW / 2}
            y={plotH + 32}
            textAnchor="middle"
            style={{ ...labelStyle, fontSize: 11, fill: C.textSecondary }}
          >
            {options.xAxisLabel}
          </text>
        )}

        {/* Legend */}
        {options.showLegend && seriesList.length > 1 && (
          <g transform={`translate(${plotW - 120}, 0)`}>
            {seriesList.map((s, i) => (
              <g key={`leg-${i}`} transform={`translate(0, ${i * 16})`}>
                <rect
                  x={0}
                  y={-8}
                  width={12}
                  height={3}
                  fill={color(i, options.colorOverrides)}
                />
                <text x={16} y={-4} style={{ ...labelStyle, fontSize: 10 }}>
                  {s.name}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. GanttChart
// ---------------------------------------------------------------------------

export const GanttChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const rowH = 28;
  const dynamicH = Math.max(H, headerH + 60 + items.length * rowH + sourceH + 20);
  const margin = { top: headerH + 8, right: 16, bottom: 20 + sourceH, left: 120 };
  const plotW = W - margin.left - margin.right;

  // Extract start/end
  const starts = items.map((it) => Number(it.start ?? it.value));
  const ends = items.map((it) => Number(it.end ?? it.value));
  const tMin = Math.min(...starts);
  const tMax = Math.max(...ends);
  const tRange = tMax - tMin || 1;

  const scaleX = (v: number) => ((v - tMin) / tRange) * plotW;

  // Categories for coloring
  const categories = Array.from(new Set(items.map((it) => String(it.category ?? ''))));

  // Time grid ticks
  const nTicks = Math.min(8, Math.ceil(tRange) + 1);
  const tStep = tRange / nTicks;
  const tTicks: number[] = [];
  for (let i = 0; i <= nTicks; i++) tTicks.push(tMin + i * tStep);

  return (
    <svg
      viewBox={`0 0 ${W} ${dynamicH}`}
      width={W}
      height={dynamicH}
      style={{ fontFamily: FONT }}
    >
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid lines */}
        {options.showGrid &&
          tTicks.map((t, i) => (
            <line
              key={`g-${i}`}
              x1={scaleX(t)}
              y1={0}
              x2={scaleX(t)}
              y2={items.length * rowH}
              stroke={C.gridLine}
              strokeWidth={0.8}
            />
          ))}

        {/* Time axis at top */}
        <line x1={0} y1={0} x2={plotW} y2={0} stroke={C.axis} strokeWidth={0.8} />
        {tTicks.map((t, i) => (
          <text
            key={`tt-${i}`}
            x={scaleX(t)}
            y={-6}
            textAnchor="middle"
            style={labelStyle}
          >
            {fmt(t)}
          </text>
        ))}

        {/* Task bars */}
        {items.map((it, i) => {
          const s = Number(it.start ?? it.value);
          const e = Number(it.end ?? it.value);
          const catIdx = categories.indexOf(String(it.category ?? ''));
          const barColor = color(Math.max(catIdx, 0), options.colorOverrides);
          const x1 = scaleX(s);
          const barW = Math.max(scaleX(e) - x1, 2);
          const y = i * rowH + 6;
          const barH = rowH - 12;

          return (
            <g key={`task-${i}`}>
              {/* Alternating row background */}
              {i % 2 === 0 && (
                <rect
                  x={0}
                  y={i * rowH}
                  width={plotW}
                  height={rowH}
                  fill={C.gridLineFaint}
                />
              )}
              {/* Task label */}
              <text
                x={-8}
                y={i * rowH + rowH / 2 + 4}
                textAnchor="end"
                style={labelStyle}
              >
                {it.label}
              </text>
              {/* Bar */}
              <rect
                x={x1}
                y={y}
                width={barW}
                height={barH}
                fill={barColor}
                rx={2}
              />
              {/* Duration label inside bar if wide enough */}
              {barW > 40 && (
                <text
                  x={x1 + barW / 2}
                  y={y + barH / 2 + 4}
                  textAnchor="middle"
                  style={{
                    fontFamily: FONT,
                    fontSize: 9,
                    fill: '#FFFFFF',
                    fontWeight: 600,
                  }}
                >
                  {fmt(s)} - {fmt(e)}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend for categories */}
        {options.showLegend && categories.length > 1 && categories[0] !== '' && (
          <g transform={`translate(0, ${items.length * rowH + 16})`}>
            {categories.map((cat, i) => (
              <g key={`leg-${i}`} transform={`translate(${i * 100}, 0)`}>
                <rect
                  x={0}
                  y={-8}
                  width={12}
                  height={12}
                  fill={color(i, options.colorOverrides)}
                  rx={2}
                />
                <text x={16} y={2} style={{ ...labelStyle, fontSize: 10 }}>
                  {cat}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>
      {renderSource(options, 0, dynamicH - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. TimelineChart
// ---------------------------------------------------------------------------

export const TimelineChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  // Sort by value (year/date) ascending
  const sorted = [...items].sort((a, b) => a.value - b.value);

  const { headerH, sourceH } = headerHeight(options);
  const cardH = 52;
  const cardGap = 12;
  const dynamicH = Math.max(
    H,
    headerH + 20 + sorted.length * (cardH + cardGap) + sourceH + 20,
  );
  const margin = { top: headerH + 12, right: 16, bottom: 20 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const centerX = plotW / 2;
  const cardW = plotW * 0.38;

  return (
    <svg
      viewBox={`0 0 ${W} ${dynamicH}`}
      width={W}
      height={dynamicH}
      style={{ fontFamily: FONT }}
    >
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Central vertical line */}
        <line
          x1={centerX}
          y1={0}
          x2={centerX}
          y2={sorted.length * (cardH + cardGap)}
          stroke={C.border}
          strokeWidth={2}
        />

        {sorted.map((item, i) => {
          const isLeft = i % 2 === 0;
          const yPos = i * (cardH + cardGap);
          const dotR = 6;
          const cardX = isLeft
            ? centerX - cardW - 24
            : centerX + 24;
          const lineX1 = isLeft ? centerX - 24 : centerX + 24;
          const lineX2 = centerX;
          const desc = String(item.description ?? '');

          return (
            <g key={`ev-${i}`}>
              {/* Dot on timeline */}
              <circle
                cx={centerX}
                cy={yPos + cardH / 2}
                r={dotR}
                fill={color(i, options.colorOverrides)}
                stroke={C.background}
                strokeWidth={2}
              />

              {/* Connecting line from dot to card */}
              <line
                x1={lineX2}
                y1={yPos + cardH / 2}
                x2={lineX1}
                y2={yPos + cardH / 2}
                stroke={C.border}
                strokeWidth={1}
              />

              {/* Card background */}
              <rect
                x={cardX}
                y={yPos}
                width={cardW}
                height={cardH}
                fill={C.background}
                stroke={C.border}
                strokeWidth={1}
                rx={3}
              />

              {/* Year/date badge */}
              <rect
                x={cardX}
                y={yPos}
                width={cardW}
                height={18}
                fill={color(i, options.colorOverrides)}
                rx={3}
              />
              {/* Bottom corners need to be square for the badge top */}
              <rect
                x={cardX}
                y={yPos + 10}
                width={cardW}
                height={8}
                fill={color(i, options.colorOverrides)}
              />
              <text
                x={cardX + 8}
                y={yPos + 13}
                style={{
                  fontFamily: FONT,
                  fontSize: 10,
                  fontWeight: 700,
                  fill: '#FFFFFF',
                }}
              >
                {fmt(item.value)}
              </text>

              {/* Event label */}
              <text
                x={cardX + 8}
                y={yPos + 32}
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 600,
                  fill: C.textPrimary,
                }}
              >
                {item.label}
              </text>

              {/* Description (truncate) */}
              {desc && (
                <text
                  x={cardX + 8}
                  y={yPos + 45}
                  style={{
                    fontFamily: FONT,
                    fontSize: 9,
                    fill: C.textSecondary,
                  }}
                >
                  {desc.length > 40 ? desc.slice(0, 37) + '...' : desc}
                </text>
              )}
            </g>
          );
        })}
      </g>
      {renderSource(options, 0, dynamicH - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 5. ErrorBarsChart
// ---------------------------------------------------------------------------

export const ErrorBarsChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 40 + sourceH, left: 50 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const values = items.map((it) => it.value);
  const errors = items.map((it) => Number(it.error ?? 0));
  const maxVal = Math.max(...values.map((v, i) => v + errors[i]));
  const minVal = Math.min(0, ...values.map((v, i) => v - errors[i]));
  const range = maxVal - minVal || 1;

  const barW = Math.min(40, (plotW / items.length) * 0.6);
  const gap = plotW / items.length;

  const scaleY = (v: number) => plotH - ((v - minVal) / range) * plotH;
  const zeroY = scaleY(0);

  // Y grid ticks
  const yTicks: number[] = [];
  const nTicks = 5;
  const yStep = range / nTicks;
  for (let i = 0; i <= nTicks; i++) yTicks.push(minVal + i * yStep);

  const whiskerCapW = barW * 0.5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid lines */}
        {options.showGrid &&
          yTicks.map((t, i) => (
            <line
              key={`g-${i}`}
              x1={0}
              y1={scaleY(t)}
              x2={plotW}
              y2={scaleY(t)}
              stroke={C.gridLine}
              strokeWidth={0.8}
            />
          ))}

        {/* Zero line if applicable */}
        {minVal < 0 && (
          <line
            x1={0}
            y1={zeroY}
            x2={plotW}
            y2={zeroY}
            stroke={C.axis}
            strokeWidth={1}
          />
        )}

        {/* Bars and error whiskers */}
        {items.map((it, i) => {
          const cx = i * gap + gap / 2;
          const val = it.value;
          const err = Number(it.error ?? 0);
          const barColor = color(i, options.colorOverrides);
          const yVal = scaleY(val);
          const yTop = scaleY(val + err);
          const yBot = scaleY(val - err);
          const barTop = Math.min(yVal, zeroY);
          const barHeight = Math.abs(yVal - zeroY);

          return (
            <g key={`bar-${i}`}>
              {/* Bar */}
              <rect
                x={cx - barW / 2}
                y={barTop}
                width={barW}
                height={Math.max(barHeight, 1)}
                fill={barColor}
                fillOpacity={0.7}
                rx={1}
              />

              {/* Error whisker — vertical line */}
              <line
                x1={cx}
                y1={yTop}
                x2={cx}
                y2={yBot}
                stroke={C.textPrimary}
                strokeWidth={1.5}
              />

              {/* Top T-cap */}
              <line
                x1={cx - whiskerCapW / 2}
                y1={yTop}
                x2={cx + whiskerCapW / 2}
                y2={yTop}
                stroke={C.textPrimary}
                strokeWidth={1.5}
              />

              {/* Bottom T-cap */}
              <line
                x1={cx - whiskerCapW / 2}
                y1={yBot}
                x2={cx + whiskerCapW / 2}
                y2={yBot}
                stroke={C.textPrimary}
                strokeWidth={1.5}
              />

              {/* Value label */}
              <text
                x={cx}
                y={yTop - 6}
                textAnchor="middle"
                style={{
                  fontFamily: FONT,
                  fontSize: 9,
                  fill: C.textSecondary,
                }}
              >
                {fmt(val, options.yAxisFormat)}
              </text>
            </g>
          );
        })}

        {/* X axis */}
        <line x1={0} y1={plotH} x2={plotW} y2={plotH} stroke={C.axis} strokeWidth={0.8} />
        {items.map((it, i) => (
          <text
            key={`xl-${i}`}
            x={i * gap + gap / 2}
            y={plotH + 16}
            textAnchor="middle"
            style={labelStyle}
          >
            {it.label}
          </text>
        ))}

        {/* Y axis ticks */}
        {yTicks.map((t, i) => (
          <text
            key={`yt-${i}`}
            x={-8}
            y={scaleY(t) + 4}
            textAnchor="end"
            style={labelStyle}
          >
            {fmt(t, options.yAxisFormat)}
          </text>
        ))}

        {/* Axis labels */}
        {options.xAxisLabel && (
          <text
            x={plotW / 2}
            y={plotH + 32}
            textAnchor="middle"
            style={{ ...labelStyle, fill: C.textSecondary }}
          >
            {options.xAxisLabel}
          </text>
        )}
        {options.yAxisLabel && (
          <text
            x={-40}
            y={plotH / 2}
            textAnchor="middle"
            transform={`rotate(-90, -40, ${plotH / 2})`}
            style={{ ...labelStyle, fill: C.textSecondary }}
          >
            {options.yAxisLabel}
          </text>
        )}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// TIER2_BATCH3_RENDERERS mapping
// ---------------------------------------------------------------------------

export const TIER2_BATCH3_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  'venn-diagram': VennDiagramChart,
  'density-plot': DensityPlotChart,
  'gantt': GanttChart,
  'timeline': TimelineChart,
  'error-bars': ErrorBarsChart,
};
