import React from 'react';
import type { SVGChartProps } from '../svg/index';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
} from '../../theme/economist';
import { WORLD_COUNTRIES, COUNTRY_MAP } from './world-paths';

// ---------------------------------------------------------------------------
// Shared constants & helpers
// ---------------------------------------------------------------------------

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;
const BG_COUNTRY = '#E8E0D4';
const VB_W = 1000;
const VB_H = 550;
const MAP_TOP = 70;
const MAP_BOTTOM = 500;

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** Interpolate between two hex colors. t in [0, 1]. */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

// ---------------------------------------------------------------------------
// Header / footer shared across all map charts
// ---------------------------------------------------------------------------

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <g>
      {/* Red top rule */}
      <line x1="0" y1="0" x2={VB_W} y2="0" stroke={C.red} strokeWidth="3" />
      {title && (
        <text x="0" y="22" fontFamily={FONT} fontSize="18" fontWeight="700" fill={C.textPrimary}>
          {title}
        </text>
      )}
      {subtitle && (
        <text x="0" y="42" fontFamily={FONT} fontSize="12" fill={C.textSecondary}>
          {subtitle}
        </text>
      )}
    </g>
  );
}

function ChartSource({ source }: { source: string }) {
  if (!source) return null;
  return (
    <text x="0" y={VB_H - 4} fontFamily={FONT} fontSize="10" fill={C.textTertiary}>
      Source: {source}
    </text>
  );
}

// ---------------------------------------------------------------------------
// Base map background (all countries in light grey)
// ---------------------------------------------------------------------------

function BaseMap({ highlighted }: { highlighted?: Record<string, string> }) {
  return (
    <g>
      {WORLD_COUNTRIES.map((c) => (
        <path
          key={c.id}
          d={c.path}
          fill={highlighted?.[c.id] ?? BG_COUNTRY}
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Tooltip helper: uses a <title> element for native SVG tooltip
// ---------------------------------------------------------------------------

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <g>
      <title>{text}</title>
      {children}
    </g>
  );
}

// ===========================================================================================
// 1. CHOROPLETH MAP
// ===========================================================================================

const ChoroplethMapChart: React.FC<SVGChartProps> = ({ data, options }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const values = items.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const lightBlue = '#D6E8F7';
  const darkBlue = '#1A3E6F';

  const colorMap: Record<string, string> = {};
  items.forEach((d) => {
    const t = (d.value - minVal) / range;
    colorMap[d.label] = lerpColor(lightBlue, darkBlue, t);
  });

  const valueMap: Record<string, number> = {};
  items.forEach((d) => { valueMap[d.label] = d.value; });

  // Legend stops
  const legendStops = 6;
  const legendY = MAP_BOTTOM + 15;
  const legendX = VB_W / 2 - 120;
  const legendW = 240;
  const segW = legendW / legendStops;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <ChartHeader title={options.title} subtitle={options.subtitle} />

      <g transform={`translate(0, ${MAP_TOP})`}>
        {WORLD_COUNTRIES.map((c) => {
          const fill = colorMap[c.id] ?? BG_COUNTRY;
          const val = valueMap[c.id];
          return (
            <Tooltip key={c.id} text={val !== undefined ? `${c.name}: ${fmt(val)}` : c.name}>
              <path
                d={c.path}
                fill={fill}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                style={{ cursor: val !== undefined ? 'pointer' : 'default' }}
              />
            </Tooltip>
          );
        })}
      </g>

      {/* Color legend */}
      <g transform={`translate(0, ${MAP_TOP})`}>
        {Array.from({ length: legendStops }, (_, i) => {
          const t = i / (legendStops - 1);
          return (
            <rect
              key={i}
              x={legendX + i * segW}
              y={legendY}
              width={segW + 0.5}
              height={10}
              fill={lerpColor(lightBlue, darkBlue, t)}
            />
          );
        })}
        <text x={legendX} y={legendY + 22} fontFamily={FONT} fontSize="9" fill={C.textSecondary} textAnchor="start">
          {fmt(minVal)}
        </text>
        <text x={legendX + legendW} y={legendY + 22} fontFamily={FONT} fontSize="9" fill={C.textSecondary} textAnchor="end">
          {fmt(maxVal)}
        </text>
      </g>

      <ChartSource source={options.source} />
    </svg>
  );
};

// ===========================================================================================
// 2. BUBBLE MAP
// ===========================================================================================

const BubbleMapChart: React.FC<SVGChartProps> = ({ data, options }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const values = items.map((d) => d.value);
  const maxVal = Math.max(...values);
  const maxRadius = 30;
  const minRadius = 5;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <ChartHeader title={options.title} subtitle={options.subtitle} />

      <g transform={`translate(0, ${MAP_TOP})`}>
        <BaseMap />

        {items.map((d, i) => {
          const country = COUNTRY_MAP[d.label];
          if (!country) return null;
          const [cx, cy] = country.centroid;
          const r = minRadius + ((d.value / maxVal) ** 0.5) * (maxRadius - minRadius);
          const fillColor = options.colorOverrides?.[i] ?? getColor(i);
          return (
            <Tooltip key={d.label} text={`${country.name}: ${fmt(d.value)}`}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fillColor}
                fillOpacity={0.65}
                stroke={fillColor}
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          );
        })}
      </g>

      <ChartSource source={options.source} />
    </svg>
  );
};

// ===========================================================================================
// 3. DOT MAP
// ===========================================================================================

const DotMapChart: React.FC<SVGChartProps> = ({ data, options }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const dotRadius = 3;
  const spread = 8;

  // Arrange dots in a small cluster around centroid
  function dotPositions(cx: number, cy: number, count: number): [number, number][] {
    if (count === 1) return [[cx, cy]];
    const positions: [number, number][] = [];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const startX = cx - ((cols - 1) * spread) / 2;
    const startY = cy - ((rows - 1) * spread) / 2;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.push([startX + col * spread, startY + row * spread]);
    }
    return positions;
  }

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <ChartHeader title={options.title} subtitle={options.subtitle} />

      <g transform={`translate(0, ${MAP_TOP})`}>
        <BaseMap />

        {items.map((d, idx) => {
          const country = COUNTRY_MAP[d.label];
          if (!country) return null;
          const [cx, cy] = country.centroid;
          const count = Math.max(1, Math.min(d.value, 20)); // cap at 20 dots
          const positions = dotPositions(cx, cy, count);
          const fillColor = options.colorOverrides?.[idx] ?? getColor(0);
          return (
            <Tooltip key={d.label} text={`${country.name}: ${d.value}`}>
              <g>
                {positions.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={dotRadius}
                    fill={fillColor}
                    fillOpacity={0.8}
                  />
                ))}
              </g>
            </Tooltip>
          );
        })}
      </g>

      <ChartSource source={options.source} />
    </svg>
  );
};

// ===========================================================================================
// 4. CONNECTION MAP
// ===========================================================================================

const ConnectionMapChart: React.FC<SVGChartProps> = ({ data, options }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const maxVal = Math.max(...items.map((d) => d.value));

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <ChartHeader title={options.title} subtitle={options.subtitle} />

      <g transform={`translate(0, ${MAP_TOP})`}>
        <BaseMap />

        {items.map((d, i) => {
          const sourceId = (d.source as string) ?? d.label.split('-')[0];
          const targetId = (d.target as string) ?? d.label.split('-')[1];
          const src = COUNTRY_MAP[sourceId];
          const tgt = COUNTRY_MAP[targetId];
          if (!src || !tgt) return null;

          const [x1, y1] = src.centroid;
          const [x2, y2] = tgt.centroid;
          const mx = (x1 + x2) / 2;
          const arcHeight = 30 + (d.value / maxVal) * 60;
          const my = Math.min(y1, y2) - arcHeight;
          const strokeColor = options.colorOverrides?.[i] ?? getColor(i);

          return (
            <Tooltip key={`${sourceId}-${targetId}-${i}`} text={`${src.name} - ${tgt.name}: ${fmt(d.value)}`}>
              <g>
                <path
                  d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  strokeOpacity={0.7}
                />
                <circle cx={x1} cy={y1} r="3" fill={strokeColor} />
                <circle cx={x2} cy={y2} r="3" fill={strokeColor} />
              </g>
            </Tooltip>
          );
        })}
      </g>

      <ChartSource source={options.source} />
    </svg>
  );
};

// ===========================================================================================
// 5. FLOW MAP
// ===========================================================================================

const FlowMapChart: React.FC<SVGChartProps> = ({ data, options }) => {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const maxVal = Math.max(...items.map((d) => d.value));
  const minWidth = 1;
  const maxWidth = 8;

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        {items.map((_, i) => {
          const strokeColor = options.colorOverrides?.[i] ?? getColor(i);
          return (
            <marker
              key={`arrow-${i}`}
              id={`flow-arrow-${i}`}
              viewBox="0 0 10 8"
              refX="10"
              refY="4"
              markerWidth="8"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,4 L0,8 Z" fill={strokeColor} fillOpacity={0.8} />
            </marker>
          );
        })}
      </defs>

      <ChartHeader title={options.title} subtitle={options.subtitle} />

      <g transform={`translate(0, ${MAP_TOP})`}>
        <BaseMap />

        {items.map((d, i) => {
          const sourceId = (d.source as string) ?? d.label.split('-')[0];
          const targetId = (d.target as string) ?? d.label.split('-')[1];
          const src = COUNTRY_MAP[sourceId];
          const tgt = COUNTRY_MAP[targetId];
          if (!src || !tgt) return null;

          const [x1, y1] = src.centroid;
          const [x2, y2] = tgt.centroid;
          const mx = (x1 + x2) / 2;
          const arcHeight = 30 + (d.value / maxVal) * 50;
          const my = Math.min(y1, y2) - arcHeight;
          const strokeW = minWidth + (d.value / maxVal) * (maxWidth - minWidth);
          const strokeColor = options.colorOverrides?.[i] ?? getColor(i);

          return (
            <Tooltip key={`${sourceId}-${targetId}-${i}`} text={`${src.name} → ${tgt.name}: ${fmt(d.value)}`}>
              <g>
                <path
                  d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  strokeOpacity={0.6}
                  markerEnd={`url(#flow-arrow-${i})`}
                />
                <circle cx={x1} cy={y1} r="4" fill={strokeColor} />
              </g>
            </Tooltip>
          );
        })}
      </g>

      <ChartSource source={options.source} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Export registry
// ---------------------------------------------------------------------------

export const MAP_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  'choropleth-map': ChoroplethMapChart,
  'bubble-map': BubbleMapChart,
  'dot-map': DotMapChart,
  'connection-map': ConnectionMapChart,
  'flow-map': FlowMapChart,
};
