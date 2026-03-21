import React from 'react';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
} from '../../theme/economist';
import type { ChartOptions } from '../../types/chart';
import type { SVGChartProps } from './index';

// ---------------------------------------------------------------------------
// Shared constants & helpers (mirroring index.tsx pattern)
// ---------------------------------------------------------------------------

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;

function color(index: number, overrides: string[] = []): string {
  return overrides[index] ?? getColor(index);
}

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

const labelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: 11,
  fill: C.textSecondary,
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
// 1. SankeyChart
// ---------------------------------------------------------------------------

interface SankeyFlow {
  source: string;
  target: string;
  value: number;
}

export const SankeyChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as unknown as SankeyFlow[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 120, bottom: 16 + sourceH, left: 120 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Collect unique source and target nodes
  const sourceNodes = [...new Set(items.map((d) => d.source))];
  const targetNodes = [...new Set(items.map((d) => d.target))];

  // Compute totals per node
  const sourceTotals: Record<string, number> = {};
  const targetTotals: Record<string, number> = {};
  for (const d of items) {
    sourceTotals[d.source] = (sourceTotals[d.source] || 0) + d.value;
    targetTotals[d.target] = (targetTotals[d.target] || 0) + d.value;
  }

  const totalSource = sourceNodes.reduce((s, n) => s + (sourceTotals[n] || 0), 0);
  const totalTarget = targetNodes.reduce((s, n) => s + (targetTotals[n] || 0), 0);
  const maxTotal = Math.max(totalSource, totalTarget) || 1;

  const nodePadding = 8;

  // Position source nodes on left
  const sourcePositions: Record<string, { y: number; h: number }> = {};
  let sy = 0;
  const usableH = plotH - nodePadding * (sourceNodes.length - 1);
  for (const node of sourceNodes) {
    const h = (sourceTotals[node] / maxTotal) * usableH;
    sourcePositions[node] = { y: sy, h };
    sy += h + nodePadding;
  }

  // Position target nodes on right
  const targetPositions: Record<string, { y: number; h: number }> = {};
  let ty = 0;
  const usableHT = plotH - nodePadding * (targetNodes.length - 1);
  for (const node of targetNodes) {
    const h = (targetTotals[node] / maxTotal) * usableHT;
    targetPositions[node] = { y: ty, h };
    ty += h + nodePadding;
  }

  // Build ribbon paths
  const nodeWidth = 14;
  const sourceOffsets: Record<string, number> = {};
  const targetOffsets: Record<string, number> = {};
  for (const n of sourceNodes) sourceOffsets[n] = 0;
  for (const n of targetNodes) targetOffsets[n] = 0;

  const ribbons = items.map((d, i) => {
    const sp = sourcePositions[d.source];
    const tp = targetPositions[d.target];
    if (!sp || !tp) return null;

    const ribbonH_source = (d.value / (sourceTotals[d.source] || 1)) * sp.h;
    const ribbonH_target = (d.value / (targetTotals[d.target] || 1)) * tp.h;

    const y0 = sp.y + (sourceOffsets[d.source] || 0);
    const y1 = tp.y + (targetOffsets[d.target] || 0);

    sourceOffsets[d.source] = (sourceOffsets[d.source] || 0) + ribbonH_source;
    targetOffsets[d.target] = (targetOffsets[d.target] || 0) + ribbonH_target;

    const x0 = nodeWidth;
    const x1 = plotW - nodeWidth;
    const cx = (x0 + x1) / 2;

    const colorIdx = sourceNodes.indexOf(d.source);

    const path = `
      M ${x0},${y0}
      C ${cx},${y0} ${cx},${y1} ${x1},${y1}
      L ${x1},${y1 + ribbonH_target}
      C ${cx},${y1 + ribbonH_target} ${cx},${y0 + ribbonH_source} ${x0},${y0 + ribbonH_source}
      Z
    `;

    return (
      <path
        key={i}
        d={path}
        fill={color(colorIdx, options.colorOverrides)}
        fillOpacity={0.45}
        stroke={color(colorIdx, options.colorOverrides)}
        strokeWidth={0.5}
        strokeOpacity={0.6}
      />
    );
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Source node bars */}
        {sourceNodes.map((node, i) => {
          const pos = sourcePositions[node];
          return (
            <g key={`s-${i}`}>
              <rect
                x={0}
                y={pos.y}
                width={nodeWidth}
                height={Math.max(pos.h, 2)}
                fill={color(i, options.colorOverrides)}
                rx={2}
              />
              <text
                x={-6}
                y={pos.y + pos.h / 2 + 4}
                textAnchor="end"
                style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}
              >
                {node}
              </text>
            </g>
          );
        })}
        {/* Target node bars */}
        {targetNodes.map((node, i) => {
          const pos = targetPositions[node];
          return (
            <g key={`t-${i}`}>
              <rect
                x={plotW - nodeWidth}
                y={pos.y}
                width={nodeWidth}
                height={Math.max(pos.h, 2)}
                fill={C.textSecondary}
                rx={2}
              />
              <text
                x={plotW - nodeWidth + nodeWidth + 6}
                y={pos.y + pos.h / 2 + 4}
                textAnchor="start"
                style={{ ...labelStyle, fontSize: 10, fill: C.textPrimary }}
              >
                {node}
              </text>
            </g>
          );
        })}
        {/* Ribbons */}
        {ribbons}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. ChordChart
// ---------------------------------------------------------------------------

export const ChordChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const matrix = data.matrix;
  if (!matrix || matrix.rows.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 16 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const size = Math.min(plotW, plotH);
  const cx = plotW / 2;
  const cy = plotH / 2;
  const outerR = size / 2 - 30;
  const innerR = outerR - 14;

  const n = matrix.rows.length;
  const { values } = matrix;

  // Row totals
  const totals = values.map((row) => row.reduce((s, v) => s + v, 0));
  const grandTotal = totals.reduce((s, v) => s + v, 0) || 1;

  // Arc angles per entity (proportional to total)
  const gap = 0.04; // radians between arcs
  const totalGap = gap * n;
  const available = 2 * Math.PI - totalGap;

  const arcs: { start: number; end: number; label: string }[] = [];
  let angle = 0;
  for (let i = 0; i < n; i++) {
    const sweep = (totals[i] / grandTotal) * available;
    arcs.push({ start: angle, end: angle + sweep, label: matrix.rows[i] });
    angle += sweep + gap;
  }

  // Helper to get point on circle
  const pt = (a: number, r: number) => ({
    x: cx + r * Math.cos(a - Math.PI / 2),
    y: cy + r * Math.sin(a - Math.PI / 2),
  });

  // Draw arcs
  const arcPath = (startAngle: number, endAngle: number, r: number) => {
    const s = pt(startAngle, r);
    const e = pt(endAngle, r);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${s.x},${s.y} A ${r},${r} 0 ${large} 1 ${e.x},${e.y}`;
  };

  // Chords: track sub-offsets within each arc
  const offsets = arcs.map((a) => a.start);

  const chords: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const val = values[i][j] + (i !== j ? values[j][i] : 0);
      if (val === 0) continue;

      const arcI = arcs[i];
      const arcJ = arcs[j];
      const sweepI = ((values[i][j]) / (totals[i] || 1)) * (arcI.end - arcI.start);
      const sweepJ = ((i !== j ? values[j][i] : values[i][j]) / (totals[j] || 1)) * (arcJ.end - arcJ.start);

      const s1 = offsets[i];
      const e1 = s1 + sweepI;
      const s2 = offsets[j];
      const e2 = s2 + sweepJ;

      offsets[i] = e1;
      if (i !== j) offsets[j] = e2;

      const p1s = pt(s1, innerR);
      const p1e = pt(e1, innerR);
      const p2s = pt(s2, innerR);
      const p2e = pt(e2, innerR);

      const large1 = sweepI > Math.PI ? 1 : 0;
      const large2 = sweepJ > Math.PI ? 1 : 0;

      const d = `
        M ${p1s.x},${p1s.y}
        A ${innerR},${innerR} 0 ${large1} 1 ${p1e.x},${p1e.y}
        Q ${cx},${cy} ${p2s.x},${p2s.y}
        A ${innerR},${innerR} 0 ${large2} 1 ${p2e.x},${p2e.y}
        Q ${cx},${cy} ${p1s.x},${p1s.y}
        Z
      `;

      chords.push(
        <path
          key={`chord-${i}-${j}`}
          d={d}
          fill={color(i, options.colorOverrides)}
          fillOpacity={0.5}
          stroke={color(i, options.colorOverrides)}
          strokeWidth={0.5}
          strokeOpacity={0.4}
        />,
      );
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Outer arcs */}
        {arcs.map((arc, i) => (
          <g key={`arc-${i}`}>
            <path
              d={`${arcPath(arc.start, arc.end, outerR)} L ${pt(arc.end, innerR).x},${pt(arc.end, innerR).y} ${arcPath(arc.end, arc.start, innerR).replace('M', 'L')} Z`}
              fill={color(i, options.colorOverrides)}
              stroke="#fff"
              strokeWidth={1}
            />
            {/* Label */}
            <text
              x={pt((arc.start + arc.end) / 2, outerR + 14).x}
              y={pt((arc.start + arc.end) / 2, outerR + 14).y}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ ...labelStyle, fontSize: 9, fill: C.textPrimary }}
            >
              {arc.label}
            </text>
          </g>
        ))}
        {/* Chords */}
        {chords}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 3. SunburstChart
// ---------------------------------------------------------------------------

interface SunburstItem {
  label: string;
  value: number;
  children?: SunburstItem[];
}

export const SunburstChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as unknown as SunburstItem[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 16 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const size = Math.min(plotW, plotH);
  const cx = plotW / 2;
  const cy = plotH / 2;

  const hasChildren = items.some((d) => d.children && d.children.length > 0);
  const maxR = size / 2 - 20;
  const innerR = hasChildren ? maxR * 0.35 : maxR * 0.45;
  const midR = hasChildren ? maxR * 0.65 : maxR;
  const outerR = maxR;

  const total = items.reduce((s, d) => s + d.value, 0) || 1;

  const pt = (a: number, r: number) => ({
    x: cx + r * Math.cos(a - Math.PI / 2),
    y: cy + r * Math.sin(a - Math.PI / 2),
  });

  const arcSlice = (startAngle: number, endAngle: number, r1: number, r2: number, fillColor: string, key: string) => {
    const s1 = pt(startAngle, r1);
    const e1 = pt(endAngle, r1);
    const s2 = pt(startAngle, r2);
    const e2 = pt(endAngle, r2);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    const d = `
      M ${s2.x},${s2.y}
      A ${r2},${r2} 0 ${large} 1 ${e2.x},${e2.y}
      L ${e1.x},${e1.y}
      A ${r1},${r1} 0 ${large} 0 ${s1.x},${s1.y}
      Z
    `;
    return (
      <path
        key={key}
        d={d}
        fill={fillColor}
        stroke="#fff"
        strokeWidth={1.5}
      />
    );
  };

  const slices: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  let angle = 0;

  items.forEach((item, i) => {
    const sweep = (item.value / total) * Math.PI * 2;
    const c = color(i, options.colorOverrides);

    // Inner ring slice
    slices.push(arcSlice(angle, angle + sweep, innerR, midR, c, `inner-${i}`));

    // Label for inner ring
    if (sweep > 0.2) {
      const mid = angle + sweep / 2;
      const labelR = (innerR + midR) / 2;
      const p = pt(mid, labelR);
      labels.push(
        <text
          key={`lbl-${i}`}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ ...labelStyle, fontSize: 9, fill: '#fff', fontWeight: 600 }}
        >
          {item.label}
        </text>,
      );
    }

    // Outer ring for children
    if (hasChildren && item.children && item.children.length > 0) {
      const childTotal = item.children.reduce((s, ch) => s + ch.value, 0) || 1;
      let childAngle = angle;
      item.children.forEach((child, ci) => {
        const childSweep = (child.value / childTotal) * sweep;
        // Lighter shade
        const childColor = color(i, options.colorOverrides);
        slices.push(
          arcSlice(childAngle, childAngle + childSweep, midR + 2, outerR, childColor, `outer-${i}-${ci}`),
        );
        // Reduce opacity for distinction
        slices.push(
          <path
            key={`overlay-${i}-${ci}`}
            d={`
              M ${pt(childAngle, midR + 2).x},${pt(childAngle, midR + 2).y}
              A ${midR + 2},${midR + 2} 0 ${childSweep > Math.PI ? 1 : 0} 1 ${pt(childAngle + childSweep, midR + 2).x},${pt(childAngle + childSweep, midR + 2).y}
              L ${pt(childAngle + childSweep, outerR).x},${pt(childAngle + childSweep, outerR).y}
              A ${outerR},${outerR} 0 ${childSweep > Math.PI ? 1 : 0} 0 ${pt(childAngle, outerR).x},${pt(childAngle, outerR).y}
              Z
            `}
            fill={ci % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
            stroke="#fff"
            strokeWidth={1}
          />,
        );
        if (childSweep > 0.25) {
          const mp = pt(childAngle + childSweep / 2, (midR + outerR) / 2);
          labels.push(
            <text
              key={`clbl-${i}-${ci}`}
              x={mp.x}
              y={mp.y}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ ...labelStyle, fontSize: 8, fill: C.textPrimary }}
            >
              {child.label}
            </text>,
          );
        }
        childAngle += childSweep;
      });
    }

    angle += sweep;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {slices}
        {labels}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. CirclePackingChart
// ---------------------------------------------------------------------------

interface PackItem {
  label: string;
  value: number;
  children?: PackItem[];
}

interface PackedCircle {
  x: number;
  y: number;
  r: number;
  label: string;
  colorIdx: number;
  depth: number;
}

function packCircles(
  items: PackItem[],
  cx: number,
  cy: number,
  outerR: number,
  colorOffset: number,
): PackedCircle[] {
  const result: PackedCircle[] = [];
  if (items.length === 0) return result;

  const total = items.reduce((s, d) => s + d.value, 0) || 1;

  // Sort descending for better packing
  const sorted = [...items].sort((a, b) => b.value - a.value);

  // Simple concentric / spiral placement
  const placed: { x: number; y: number; r: number }[] = [];

  sorted.forEach((item, i) => {
    const area = (item.value / total) * Math.PI * outerR * outerR * 0.75;
    const r = Math.max(Math.sqrt(area / Math.PI), 8);

    let bestX = cx;
    let bestY = cy;

    if (placed.length === 0) {
      bestX = cx;
      bestY = cy;
    } else {
      // Try positions around existing circles
      let bestDist = Infinity;
      for (let attempt = 0; attempt < 200; attempt++) {
        const angle = (attempt / 200) * Math.PI * 2 * 5;
        const dist = (attempt / 200) * (outerR - r);
        const tx = cx + dist * Math.cos(angle);
        const ty = cy + dist * Math.sin(angle);

        // Check no overlap with placed circles
        let overlaps = false;
        for (const p of placed) {
          const dx = tx - p.x;
          const dy = ty - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < r + p.r + 2) {
            overlaps = true;
            break;
          }
        }

        // Check within outer boundary
        const dFromCenter = Math.sqrt((tx - cx) ** 2 + (ty - cy) ** 2);
        if (dFromCenter + r > outerR) overlaps = true;

        if (!overlaps && dist < bestDist) {
          bestDist = dist;
          bestX = tx;
          bestY = ty;
        }
      }
    }

    placed.push({ x: bestX, y: bestY, r });
    result.push({
      x: bestX,
      y: bestY,
      r,
      label: item.label,
      colorIdx: colorOffset + i,
      depth: 0,
    });

    // Pack children inside this circle
    if (item.children && item.children.length > 0) {
      const childCircles = packCircles(
        item.children,
        bestX,
        bestY,
        r * 0.85,
        colorOffset + i,
      );
      childCircles.forEach((c) => {
        c.depth = 1;
        result.push(c);
      });
    }
  });

  return result;
}

export const CirclePackingChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as unknown as PackItem[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 8, right: 16, bottom: 16 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;
  const size = Math.min(plotW, plotH);
  const cx = plotW / 2;
  const cy = plotH / 2;
  const outerR = size / 2 - 10;

  const packed = packCircles(items, cx, cy, outerR, 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Outer boundary */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke={C.gridLine}
          strokeWidth={1}
        />
        {/* Depth 0 circles first (parents) */}
        {packed
          .filter((c) => c.depth === 0)
          .map((c, i) => (
            <g key={`p-${i}`}>
              <circle
                cx={c.x}
                cy={c.y}
                r={c.r}
                fill={color(c.colorIdx, options.colorOverrides)}
                fillOpacity={0.2}
                stroke={color(c.colorIdx, options.colorOverrides)}
                strokeWidth={1.5}
              />
              {c.r > 20 && (
                <text
                  x={c.x}
                  y={c.y + 4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    ...labelStyle,
                    fontSize: Math.min(10, c.r * 0.35),
                    fill: C.textPrimary,
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                </text>
              )}
            </g>
          ))}
        {/* Depth 1 circles (children) */}
        {packed
          .filter((c) => c.depth === 1)
          .map((c, i) => (
            <g key={`c-${i}`}>
              <circle
                cx={c.x}
                cy={c.y}
                r={c.r}
                fill={color(c.colorIdx, options.colorOverrides)}
                fillOpacity={0.55}
                stroke="#fff"
                strokeWidth={1}
              />
              {c.r > 14 && (
                <text
                  x={c.x}
                  y={c.y + 3}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    ...labelStyle,
                    fontSize: Math.min(8, c.r * 0.4),
                    fill: '#fff',
                    fontWeight: 500,
                  }}
                >
                  {c.label}
                </text>
              )}
            </g>
          ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 5. TreeDiagramChart
// ---------------------------------------------------------------------------

interface TreeNode {
  label: string;
  value: number;
  children?: TreeNode[];
}

interface LayoutNode {
  x: number;
  y: number;
  label: string;
  value: number;
  depth: number;
  parentX?: number;
  parentY?: number;
}

function layoutTree(
  nodes: TreeNode[],
  plotW: number,
  plotH: number,
): LayoutNode[] {
  const result: LayoutNode[] = [];
  if (nodes.length === 0) return result;

  // Calculate max depth
  function maxDepth(items: TreeNode[], d: number): number {
    let max = d;
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        max = Math.max(max, maxDepth(item.children, d + 1));
      }
    }
    return max;
  }

  const depth = maxDepth(nodes, 0);
  const levelH = depth > 0 ? plotH / depth : plotH;

  // Count leaves to determine spacing
  function countLeaves(items: TreeNode[]): number {
    let count = 0;
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        count += countLeaves(item.children);
      } else {
        count += 1;
      }
    }
    return Math.max(count, 1);
  }

  // Layout recursively
  function place(
    items: TreeNode[],
    d: number,
    xStart: number,
    xEnd: number,
    parentX?: number,
    parentY?: number,
  ) {
    const totalLeaves = countLeaves(items);
    let xOffset = xStart;

    for (const item of items) {
      const leaves = item.children && item.children.length > 0
        ? countLeaves(item.children)
        : 1;
      const width = ((xEnd - xStart) * leaves) / totalLeaves;
      const x = xOffset + width / 2;
      const y = d * levelH;

      result.push({
        x,
        y,
        label: item.label,
        value: item.value,
        depth: d,
        parentX,
        parentY,
      });

      if (item.children && item.children.length > 0) {
        place(item.children, d + 1, xOffset, xOffset + width, x, y);
      }

      xOffset += width;
    }
  }

  // If there's a single root, start from it; otherwise treat as multiple roots
  if (nodes.length === 1) {
    const root = nodes[0];
    const rootX = plotW / 2;
    const rootY = 0;
    result.push({
      x: rootX,
      y: rootY,
      label: root.label,
      value: root.value,
      depth: 0,
    });
    if (root.children && root.children.length > 0) {
      place(root.children, 1, 0, plotW, rootX, rootY);
    }
  } else {
    place(nodes, 0, 0, plotW);
  }

  return result;
}

export const TreeDiagramChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items as unknown as TreeNode[] | undefined;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 24, right: 40, bottom: 40 + sourceH, left: 40 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const nodes = layoutTree(items, plotW, plotH);
  const nodeR = 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      <g transform="translate(0,0)">{renderHeader(options, W)}</g>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Elbow connectors */}
        {nodes
          .filter((n) => n.parentX !== undefined && n.parentY !== undefined)
          .map((n, i) => {
            const midY = ((n.parentY ?? 0) + n.y) / 2;
            return (
              <path
                key={`edge-${i}`}
                d={`M ${n.parentX},${(n.parentY ?? 0) + nodeR} L ${n.parentX},${midY} L ${n.x},${midY} L ${n.x},${n.y - nodeR}`}
                fill="none"
                stroke={C.gridLine}
                strokeWidth={1.5}
              />
            );
          })}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={nodeR}
              fill={n.depth === 0 ? C.red : color(n.depth - 1, options.colorOverrides)}
              stroke="#fff"
              strokeWidth={1.5}
            />
            <text
              x={n.x}
              y={n.y - nodeR - 5}
              textAnchor="middle"
              style={{
                ...labelStyle,
                fontSize: 9,
                fill: C.textPrimary,
                fontWeight: n.depth === 0 ? 700 : 400,
              }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Renderer mapping
// ---------------------------------------------------------------------------

export const TIER2_BATCH1_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  'sankey': SankeyChart,
  'chord': ChordChart,
  'sunburst': SunburstChart,
  'circle-packing': CirclePackingChart,
  'tree-diagram': TreeDiagramChart,
};
