import React from 'react';
import {
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
} from '../../theme/economist';
import type { ChartOptions } from '../../types/chart';
import type { SVGChartProps } from './index';

// ---------------------------------------------------------------------------
// Shared constants & helpers (mirrors index.tsx pattern)
// ---------------------------------------------------------------------------

const FONT = ECONOMIST_FONTS.sans;
const C = ECONOMIST_COLORS;

function color(index: number, overrides: string[] = []): string {
  return overrides[index] ?? getColor(index);
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
// 1. NetworkDiagramChart
// ---------------------------------------------------------------------------

export const NetworkDiagramChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 12, right: 24, bottom: 20 + sourceH, left: 24 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // Build adjacency from connections
  const labelToIdx: Record<string, number> = {};
  items.forEach((item, i) => {
    labelToIdx[item.label] = i;
  });

  const edges: [number, number][] = [];
  items.forEach((item, i) => {
    const conns = (item.connections as string[] | undefined) ?? [];
    conns.forEach((c) => {
      const j = labelToIdx[c];
      if (j !== undefined && j > i) {
        edges.push([i, j]);
      }
    });
  });

  // Node sizes proportional to value
  const maxVal = Math.max(...items.map((d) => d.value), 1);
  const minR = 6;
  const maxR = 24;
  const radii = items.map((d) => minR + ((d.value / maxVal) * (maxR - minR)));

  // Simple force-directed layout (spring-based, 50 iterations)
  const positions = items.map(() => ({
    x: plotW * 0.15 + Math.random() * plotW * 0.7,
    y: plotH * 0.15 + Math.random() * plotH * 0.7,
    vx: 0,
    vy: 0,
  }));

  const repulsion = 2000;
  const springK = 0.02;
  const idealLen = 80;
  const damping = 0.85;

  for (let iter = 0; iter < 50; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        let dx = positions[i].x - positions[j].x;
        let dy = positions[i].y - positions[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repulsion / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        positions[i].vx += fx;
        positions[i].vy += fy;
        positions[j].vx -= fx;
        positions[j].vy -= fy;
      }
    }

    // Attraction along edges
    for (const [i, j] of edges) {
      const dx = positions[j].x - positions[i].x;
      const dy = positions[j].y - positions[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = springK * (dist - idealLen);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      positions[i].vx += fx;
      positions[i].vy += fy;
      positions[j].vx -= fx;
      positions[j].vy -= fy;
    }

    // Integrate and clamp
    for (let i = 0; i < items.length; i++) {
      positions[i].vx *= damping;
      positions[i].vy *= damping;
      positions[i].x += positions[i].vx;
      positions[i].y += positions[i].vy;
      positions[i].x = Math.max(maxR, Math.min(plotW - maxR, positions[i].x));
      positions[i].y = Math.max(maxR, Math.min(plotH - maxR, positions[i].y));
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Edges */}
        {edges.map(([i, j], idx) => (
          <line
            key={`edge-${idx}`}
            x1={positions[i].x}
            y1={positions[i].y}
            x2={positions[j].x}
            y2={positions[j].y}
            stroke={C.gridLine}
            strokeWidth={1.5}
            opacity={0.7}
          />
        ))}
        {/* Nodes */}
        {items.map((item, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={positions[i].x}
              cy={positions[i].y}
              r={radii[i]}
              fill={color(i, options.colorOverrides)}
              opacity={0.85}
              stroke={C.background}
              strokeWidth={1.5}
            />
            <text
              x={positions[i].x}
              y={positions[i].y + radii[i] + 13}
              textAnchor="middle"
              style={{ ...labelStyle, fontSize: 10 }}
            >
              {item.label}
            </text>
          </g>
        ))}
      </g>
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 2. ParallelCoordinatesChart
// ---------------------------------------------------------------------------

export const ParallelCoordinatesChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const matrix = data.matrix;
  if (!matrix || matrix.rows.length === 0 || matrix.cols.length === 0) return null;

  const { rows, cols, values } = matrix;
  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 12, right: 30, bottom: 28 + sourceH, left: 30 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const nAxes = cols.length;
  const axisSpacing = nAxes > 1 ? plotW / (nAxes - 1) : plotW;

  // Normalize each column independently
  const colMin = cols.map((_, c) => Math.min(...values.map((row) => row[c])));
  const colMax = cols.map((_, c) => Math.max(...values.map((row) => row[c])));
  const colRange = colMin.map((mn, c) => colMax[c] - mn || 1);

  function yPos(rowIdx: number, colIdx: number): number {
    const normalized = (values[rowIdx][colIdx] - colMin[colIdx]) / colRange[colIdx];
    return plotH - normalized * plotH;
  }

  // Gridlines per axis (5 ticks)
  const tickCount = 5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Axes and ticks */}
        {cols.map((colName, c) => {
          const x = nAxes > 1 ? c * axisSpacing : plotW / 2;
          return (
            <g key={`axis-${c}`}>
              <line x1={x} y1={0} x2={x} y2={plotH} stroke={C.axis} strokeWidth={1} />
              {/* Axis label at top */}
              <text
                x={x}
                y={-8}
                textAnchor="middle"
                style={{ ...labelStyle, fontWeight: 600, fontSize: 10 }}
              >
                {colName}
              </text>
              {/* Tick marks */}
              {Array.from({ length: tickCount + 1 }, (_, t) => {
                const frac = t / tickCount;
                const yy = plotH - frac * plotH;
                const val = colMin[c] + frac * colRange[c];
                return (
                  <g key={`tick-${c}-${t}`}>
                    <line x1={x - 3} y1={yy} x2={x + 3} y2={yy} stroke={C.axis} strokeWidth={0.8} />
                    {(t === 0 || t === tickCount) && (
                      <text
                        x={x - 6}
                        y={yy + 3}
                        textAnchor="end"
                        style={{ ...labelStyle, fontSize: 9 }}
                      >
                        {Number.isInteger(val) ? String(val) : val.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        {/* Data lines */}
        {rows.map((_rowName, r) => {
          const points = cols.map((_, c) => {
            const x = nAxes > 1 ? c * axisSpacing : plotW / 2;
            return `${x},${yPos(r, c)}`;
          });
          return (
            <polyline
              key={`line-${r}`}
              points={points.join(' ')}
              fill="none"
              stroke={color(r, options.colorOverrides)}
              strokeWidth={1.8}
              opacity={0.75}
            />
          );
        })}
        {/* Legend */}
        {options.showLegend && (
          <g transform={`translate(0,${plotH + 16})`}>
            {rows.map((rowName, r) => (
              <g key={`leg-${r}`} transform={`translate(${r * 90},0)`}>
                <rect x={0} y={-6} width={10} height={10} fill={color(r, options.colorOverrides)} rx={2} />
                <text x={14} y={3} style={{ ...labelStyle, fontSize: 9 }}>
                  {rowName}
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
// 3. StreamGraphChart
// ---------------------------------------------------------------------------

export const StreamGraphChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const labels = data.labels;
  const series = data.series;
  if (!labels || !series || labels.length === 0 || series.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 12, right: 16, bottom: 36 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const n = labels.length;
  const nSeries = series.length;

  // Compute stacked values
  // stackTop[s][i] = cumulative top of series s at point i
  const stackBot: number[][] = Array.from({ length: nSeries }, () => new Array(n).fill(0));
  const stackTop: number[][] = Array.from({ length: nSeries }, () => new Array(n).fill(0));

  // First compute raw stacks (bottom = 0)
  for (let i = 0; i < n; i++) {
    let cumulative = 0;
    for (let s = 0; s < nSeries; s++) {
      stackBot[s][i] = cumulative;
      cumulative += series[s].data[i] ?? 0;
      stackTop[s][i] = cumulative;
    }
  }

  // Silhouette centering: shift so the center of each column is at 0
  for (let i = 0; i < n; i++) {
    const total = stackTop[nSeries - 1][i];
    const offset = -total / 2;
    for (let s = 0; s < nSeries; s++) {
      stackBot[s][i] += offset;
      stackTop[s][i] += offset;
    }
  }

  // Find global range
  let globalMin = Infinity;
  let globalMax = -Infinity;
  for (let s = 0; s < nSeries; s++) {
    for (let i = 0; i < n; i++) {
      if (stackBot[s][i] < globalMin) globalMin = stackBot[s][i];
      if (stackTop[s][i] > globalMax) globalMax = stackTop[s][i];
    }
  }
  const valueRange = globalMax - globalMin || 1;

  function scaleX(i: number): number {
    return n > 1 ? (i / (n - 1)) * plotW : plotW / 2;
  }
  function scaleY(v: number): number {
    return plotH - ((v - globalMin) / valueRange) * plotH;
  }

  // Build cubic bezier path for a stream band
  function buildStreamPath(topArr: number[], botArr: number[]): string {
    if (n === 1) {
      // Single point: draw a small rectangle
      const x = scaleX(0);
      const yt = scaleY(topArr[0]);
      const yb = scaleY(botArr[0]);
      return `M${x - 4},${yt} L${x + 4},${yt} L${x + 4},${yb} L${x - 4},${yb} Z`;
    }

    // Forward path (top)
    let d = `M${scaleX(0)},${scaleY(topArr[0])}`;
    for (let i = 1; i < n; i++) {
      const x0 = scaleX(i - 1);
      const x1 = scaleX(i);
      const mx = (x0 + x1) / 2;
      const y0 = scaleY(topArr[i - 1]);
      const y1 = scaleY(topArr[i]);
      d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }

    // Reverse path (bottom)
    d += ` L${scaleX(n - 1)},${scaleY(botArr[n - 1])}`;
    for (let i = n - 2; i >= 0; i--) {
      const x0 = scaleX(i + 1);
      const x1 = scaleX(i);
      const mx = (x0 + x1) / 2;
      const y0 = scaleY(botArr[i + 1]);
      const y1 = scaleY(botArr[i]);
      d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    d += ' Z';
    return d;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Streams */}
        {series.map((_s, si) => (
          <path
            key={`stream-${si}`}
            d={buildStreamPath(stackTop[si], stackBot[si])}
            fill={color(si, options.colorOverrides)}
            opacity={0.82}
          />
        ))}
        {/* X-axis labels */}
        {labels.map((lbl, i) => {
          // Show a subset of labels to avoid clutter
          const step = Math.max(1, Math.floor(n / 8));
          if (i % step !== 0 && i !== n - 1) return null;
          return (
            <text
              key={`xlbl-${i}`}
              x={scaleX(i)}
              y={plotH + 16}
              textAnchor="middle"
              style={labelStyle}
            >
              {lbl}
            </text>
          );
        })}
        {/* Baseline */}
        <line x1={0} y1={scaleY(0)} x2={plotW} y2={scaleY(0)} stroke={C.axis} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.5} />
      </g>
      {/* Legend */}
      {options.showLegend && (
        <g transform={`translate(${margin.left},${H - margin.bottom + 24})`}>
          {series.map((s, si) => (
            <g key={`leg-${si}`} transform={`translate(${si * 90},0)`}>
              <rect x={0} y={-6} width={10} height={10} fill={color(si, options.colorOverrides)} rx={2} />
              <text x={14} y={3} style={{ ...labelStyle, fontSize: 9 }}>
                {s.name}
              </text>
            </g>
          ))}
        </g>
      )}
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 4. ArcDiagramChart
// ---------------------------------------------------------------------------

export const ArcDiagramChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const items = data.items;
  if (!items || items.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 12, right: 24, bottom: 28 + sourceH, left: 24 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const n = items.length;
  const maxVal = Math.max(...items.map((d) => d.value), 1);
  const minR = 4;
  const maxR = 12;

  // Position nodes evenly along a horizontal baseline
  const baselineY = plotH * 0.75;
  const nodeX = items.map((_, i) => (n > 1 ? (i / (n - 1)) * plotW : plotW / 2));

  // Build edge list
  const labelToIdx: Record<string, number> = {};
  items.forEach((item, i) => {
    labelToIdx[item.label] = i;
  });

  const arcs: { from: number; to: number; arcIdx: number }[] = [];
  let arcCount = 0;
  items.forEach((item, i) => {
    const conns = (item.connections as string[] | undefined) ?? [];
    conns.forEach((c) => {
      const j = labelToIdx[c];
      if (j !== undefined && j > i) {
        arcs.push({ from: i, to: j, arcIdx: arcCount++ });
      }
    });
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Arcs */}
        {arcs.map(({ from, to, arcIdx }) => {
          const x1 = nodeX[from];
          const x2 = nodeX[to];
          const dist = Math.abs(x2 - x1);
          const arcR = dist / 2;
          return (
            <path
              key={`arc-${arcIdx}`}
              d={`M${x1},${baselineY} A${arcR},${arcR} 0 0,1 ${x2},${baselineY}`}
              fill="none"
              stroke={color(arcIdx, options.colorOverrides)}
              strokeWidth={1.8}
              opacity={0.6}
            />
          );
        })}
        {/* Baseline */}
        <line x1={0} y1={baselineY} x2={plotW} y2={baselineY} stroke={C.gridLine} strokeWidth={1} />
        {/* Nodes */}
        {items.map((item, i) => {
          const r = minR + (item.value / maxVal) * (maxR - minR);
          return (
            <g key={`node-${i}`}>
              <circle
                cx={nodeX[i]}
                cy={baselineY}
                r={r}
                fill={color(i, options.colorOverrides)}
                stroke={C.background}
                strokeWidth={1.5}
              />
              <text
                x={nodeX[i]}
                y={baselineY + r + 14}
                textAnchor="middle"
                style={{ ...labelStyle, fontSize: 10 }}
              >
                {item.label}
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
// 5. MarimekkoChart
// ---------------------------------------------------------------------------

export const MarimekkoChart: React.FC<SVGChartProps> = ({
  data,
  options,
  width: W = options.width,
  height: H = options.height,
}) => {
  const labels = data.labels;
  const series = data.series;
  if (!labels || !series || labels.length === 0 || series.length === 0) return null;

  const { headerH, sourceH } = headerHeight(options);
  const margin = { top: headerH + 12, right: 16, bottom: 40 + sourceH, left: 16 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const nCols = labels.length;
  const gap = 2;

  // Column totals determine widths
  const colTotals = labels.map((_, ci) =>
    series.reduce((sum, s) => sum + (s.data[ci] ?? 0), 0),
  );
  const grandTotal = colTotals.reduce((a, b) => a + b, 0) || 1;
  const totalGap = gap * (nCols - 1);
  const availW = plotW - totalGap;

  // Cumulative x positions
  const colWidths = colTotals.map((t) => (t / grandTotal) * availW);
  const colX: number[] = [];
  let cx = 0;
  for (let ci = 0; ci < nCols; ci++) {
    colX.push(cx);
    cx += colWidths[ci] + gap;
  }

  // Gridlines
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: FONT }}>
      {renderHeader(options, W)}
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Horizontal gridlines */}
        {options.showGrid &&
          gridLines.map((frac) => {
            const yy = plotH - frac * plotH;
            return (
              <line
                key={`grid-${frac}`}
                x1={0}
                y1={yy}
                x2={plotW}
                y2={yy}
                stroke={C.gridLine}
                strokeWidth={0.8}
              />
            );
          })}
        {/* Y-axis percentage labels */}
        {gridLines.map((frac) => {
          const yy = plotH - frac * plotH;
          return (
            <text
              key={`ylbl-${frac}`}
              x={-4}
              y={yy + 3}
              textAnchor="end"
              style={{ ...labelStyle, fontSize: 9 }}
            >
              {`${Math.round(frac * 100)}%`}
            </text>
          );
        })}
        {/* Columns */}
        {labels.map((lbl, ci) => {
          const colTotal = colTotals[ci] || 1;
          let cumY = 0;
          return (
            <g key={`col-${ci}`}>
              {series.map((s, si) => {
                const val = s.data[ci] ?? 0;
                const frac = val / colTotal;
                const segH = frac * plotH;
                const yy = plotH - cumY - segH;
                cumY += segH;
                return (
                  <g key={`seg-${ci}-${si}`}>
                    <rect
                      x={colX[ci]}
                      y={yy}
                      width={colWidths[ci]}
                      height={Math.max(0, segH)}
                      fill={color(si, options.colorOverrides)}
                      opacity={0.85}
                    />
                    {/* Label inside segment if tall enough */}
                    {segH > 16 && colWidths[ci] > 30 && (
                      <text
                        x={colX[ci] + colWidths[ci] / 2}
                        y={yy + segH / 2 + 4}
                        textAnchor="middle"
                        style={{
                          fontFamily: FONT,
                          fontSize: Math.min(10, colWidths[ci] / 5),
                          fill: '#FFFFFF',
                          fontWeight: 600,
                        }}
                      >
                        {`${Math.round(frac * 100)}%`}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Column label */}
              <text
                x={colX[ci] + colWidths[ci] / 2}
                y={plotH + 14}
                textAnchor="middle"
                style={{ ...labelStyle, fontSize: Math.min(10, colWidths[ci] / 3) }}
              >
                {lbl}
              </text>
            </g>
          );
        })}
      </g>
      {/* Legend */}
      {options.showLegend && (
        <g transform={`translate(${margin.left},${H - margin.bottom + 24})`}>
          {series.map((s, si) => (
            <g key={`leg-${si}`} transform={`translate(${si * 90},0)`}>
              <rect x={0} y={-6} width={10} height={10} fill={color(si, options.colorOverrides)} rx={2} />
              <text x={14} y={3} style={{ ...labelStyle, fontSize: 9 }}>
                {s.name}
              </text>
            </g>
          ))}
        </g>
      )}
      {renderSource(options, 0, H - 6)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// TIER2_BATCH2_RENDERERS mapping
// ---------------------------------------------------------------------------

export const TIER2_BATCH2_RENDERERS: Record<string, React.FC<SVGChartProps>> = {
  'network-diagram': NetworkDiagramChart,
  'parallel-coordinates': ParallelCoordinatesChart,
  'stream-graph': StreamGraphChart,
  'arc-diagram': ArcDiagramChart,
  'marimekko': MarimekkoChart,
};
