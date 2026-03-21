import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Scatter, Bubble, Pie, Doughnut, Radar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from '../../types/chart';
import {
  CHARTJS_ECONOMIST_DEFAULTS,
  ECONOMIST_COLORS,
  ECONOMIST_FONTS,
  getColor,
  getColors,
} from '../../theme/economist';

// ---------------------------------------------------------------------------
// Register Chart.js components once
// ---------------------------------------------------------------------------
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
);

// ---------------------------------------------------------------------------
// Shared props interface
// ---------------------------------------------------------------------------
export interface ChartJSChartProps {
  data: ChartData;
  options: ChartOptions;
  height?: number;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Deep merge two objects (b wins). Handles nested plain objects only. */
function deepMerge<T extends Record<string, unknown>>(a: T, b: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...a };
  for (const key of Object.keys(b)) {
    const av = (a as Record<string, unknown>)[key];
    const bv = b[key];
    if (
      av &&
      bv &&
      typeof av === 'object' &&
      typeof bv === 'object' &&
      !Array.isArray(av) &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(av as Record<string, unknown>, bv as Record<string, unknown>);
    } else {
      out[key] = bv;
    }
  }
  return out as T;
}

/** Resolve series colors: user overrides first, then theme palette. */
function resolveColors(count: number, overrides: string[] = []): string[] {
  const base = getColors(count);
  return base.map((c, i) => overrides[i] ?? c);
}

/** Format a numeric tick value based on yAxisFormat. */
function formatTick(value: number | string, format: ChartOptions['yAxisFormat']): string {
  const v = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(v)) return String(value);

  switch (format) {
    case 'percent':
      return `${v}%`;
    case 'currency':
      return v < 0 ? `-$${Math.abs(v).toLocaleString()}` : `$${v.toLocaleString()}`;
    case 'compact': {
      const abs = Math.abs(v);
      if (abs >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
      if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
      if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
      return v.toString();
    }
    default:
      return v.toLocaleString();
  }
}

/** Build the common Chart.js options object from our ChartOptions. */
function buildBaseOptions(
  opts: ChartOptions,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const yTickCallback = (_value: unknown, _index: number, _ticks: unknown[]) => {
    // Chart.js passes the raw value as first arg
    return formatTick(_value as number, opts.yAxisFormat);
  };

  const tooltipFilter = (tooltipItem: { label?: string | null }) =>
    tooltipItem.label != null && tooltipItem.label !== '';

  const base: Record<string, unknown> = deepMerge(
    CHARTJS_ECONOMIST_DEFAULTS as unknown as Record<string, unknown>,
    {
      plugins: {
        legend: {
          display: opts.showLegend,
          labels: {
            color: ECONOMIST_COLORS.textPrimary,
            font: { size: 11, family: ECONOMIST_FONTS.sans },
            boxWidth: 12,
            padding: 12,
          },
        },
        tooltip: {
          filter: tooltipFilter,
          callbacks: {
            label: (ctx: { dataset?: { label?: string }; formattedValue?: string; raw?: unknown }) => {
              const label = ctx.dataset?.label ?? '';
              const val = ctx.formattedValue ?? ctx.raw;
              return label ? `${label}: ${val}` : String(val);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: opts.showGrid ? false : false }, // x grid always off per Economist style
          title: opts.xAxisLabel
            ? {
                display: true,
                text: opts.xAxisLabel,
                color: ECONOMIST_COLORS.textSecondary,
                font: { size: 11, family: ECONOMIST_FONTS.sans },
              }
            : { display: false },
        },
        y: {
          grid: {
            display: opts.showGrid,
            color: ECONOMIST_COLORS.gridLine,
            lineWidth: 0.8,
          },
          ticks: {
            callback: yTickCallback,
          },
          title: opts.yAxisLabel
            ? {
                display: true,
                text: opts.yAxisLabel,
                color: ECONOMIST_COLORS.textSecondary,
                font: { size: 11, family: ECONOMIST_FONTS.sans },
              }
            : { display: false },
        },
      },
    },
  );

  if (Object.keys(overrides).length > 0) {
    return deepMerge(base, overrides);
  }
  return base;
}

/** Safe extraction of single-series values & labels. */
function singleSeries(data: ChartData): { labels: string[]; values: number[] } {
  if (data.series && data.series.length > 0) {
    return {
      labels: data.labels ?? data.series[0].data.map((_, i) => String(i)),
      values: data.series[0].data,
    };
  }
  if (data.items) {
    return {
      labels: data.items.map((it) => it.label),
      values: data.items.map((it) => it.value),
    };
  }
  return { labels: data.labels ?? [], values: [] };
}

/** Safe extraction of multi-series. */
function multiSeries(data: ChartData): {
  labels: string[];
  series: { name: string; data: number[]; color?: string }[];
} {
  const labels = data.labels ?? [];
  const series = data.series ?? [];
  return { labels, series };
}

// ---------------------------------------------------------------------------
// 1. LineChart
// ---------------------------------------------------------------------------
export const LineChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, values } = singleSeries(data);
    return {
      labels,
      datasets: [
        {
          label: data.series?.[0]?.name ?? options.title,
          data: values,
          borderColor: options.colorOverrides[0] ?? getColor(0),
          backgroundColor: options.colorOverrides[0] ?? getColor(0),
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.35,
          fill: false,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Line>['options'],
    [options],
  );

  return <Line data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 2. MultiLineChart
// ---------------------------------------------------------------------------
export const MultiLineChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, series } = multiSeries(data);
    const colors = resolveColors(series.length, options.colorOverrides);
    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.name,
        data: s.data,
        borderColor: s.color ?? colors[i],
        backgroundColor: s.color ?? colors[i],
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: false,
      })),
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Line>['options'],
    [options],
  );

  return <Line data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 3. AreaChart
// ---------------------------------------------------------------------------
export const AreaChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, values } = singleSeries(data);
    const color = options.colorOverrides[0] ?? getColor(0);
    return {
      labels,
      datasets: [
        {
          label: data.series?.[0]?.name ?? options.title,
          data: values,
          borderColor: color,
          backgroundColor: `${color}26`, // ~15% opacity
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Line>['options'],
    [options],
  );

  return <Line data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 4. StackedAreaChart
// ---------------------------------------------------------------------------
export const StackedAreaChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, series } = multiSeries(data);
    const colors = resolveColors(series.length, options.colorOverrides);
    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.name,
        data: s.data,
        borderColor: s.color ?? colors[i],
        backgroundColor: `${s.color ?? colors[i]}66`, // ~40% opacity
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.35,
        fill: true,
      })),
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () =>
      buildBaseOptions(options, {
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      }) as React.ComponentProps<typeof Line>['options'],
    [options],
  );

  return <Line data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 5. BarChart
// ---------------------------------------------------------------------------
export const BarChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, values } = singleSeries(data);
    const color = options.colorOverrides[0] ?? getColor(0);
    return {
      labels,
      datasets: [
        {
          label: data.series?.[0]?.name ?? options.title,
          data: values,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          borderRadius: 2,
          maxBarThickness: 56,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Bar>['options'],
    [options],
  );

  return <Bar data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 6. GroupedBarChart
// ---------------------------------------------------------------------------
export const GroupedBarChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, series } = multiSeries(data);
    const colors = resolveColors(series.length, options.colorOverrides);
    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.name,
        data: s.data,
        backgroundColor: s.color ?? colors[i],
        borderColor: s.color ?? colors[i],
        borderWidth: 0,
        borderRadius: 2,
        maxBarThickness: 48,
      })),
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Bar>['options'],
    [options],
  );

  return <Bar data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 7. StackedBarChart
// ---------------------------------------------------------------------------
export const StackedBarChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, series } = multiSeries(data);
    const colors = resolveColors(series.length, options.colorOverrides);
    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.name,
        data: s.data,
        backgroundColor: s.color ?? colors[i],
        borderColor: ECONOMIST_COLORS.background,
        borderWidth: 1,
        borderRadius: 0,
        maxBarThickness: 56,
      })),
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () =>
      buildBaseOptions(options, {
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      }) as React.ComponentProps<typeof Bar>['options'],
    [options],
  );

  return <Bar data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 8. HistogramChart
// ---------------------------------------------------------------------------
export const HistogramChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    // If raw data is provided, bucket it; otherwise treat as pre-bucketed single series
    if (data.raw && data.raw.length > 0) {
      const values = data.raw;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const bucketCount = Math.max(1, Math.ceil(Math.sqrt(values.length)));
      const step = (max - min) / bucketCount || 1;
      const buckets = new Array(bucketCount).fill(0) as number[];
      const labels: string[] = [];

      for (let i = 0; i < bucketCount; i++) {
        const lo = min + i * step;
        const hi = lo + step;
        labels.push(`${lo.toFixed(1)}-${hi.toFixed(1)}`);
      }

      for (const v of values) {
        let idx = Math.floor((v - min) / step);
        if (idx >= bucketCount) idx = bucketCount - 1;
        buckets[idx]++;
      }

      const color = options.colorOverrides[0] ?? getColor(0);
      return {
        labels,
        datasets: [
          {
            label: 'Frequency',
            data: buckets,
            backgroundColor: color,
            borderColor: ECONOMIST_COLORS.background,
            borderWidth: 1,
            borderRadius: 0,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
          },
        ],
      };
    }

    // Fallback: use single series as pre-bucketed histogram
    const { labels, values } = singleSeries(data);
    const color = options.colorOverrides[0] ?? getColor(0);
    return {
      labels,
      datasets: [
        {
          label: data.series?.[0]?.name ?? 'Frequency',
          data: values,
          backgroundColor: color,
          borderColor: ECONOMIST_COLORS.background,
          borderWidth: 1,
          borderRadius: 0,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => buildBaseOptions(options) as React.ComponentProps<typeof Bar>['options'],
    [options],
  );

  return <Bar data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 9. ScatterChart
// ---------------------------------------------------------------------------
export const ScatterChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const points = data.points ?? [];
    const color = options.colorOverrides[0] ?? getColor(0);

    const datasets: React.ComponentProps<typeof Scatter>['data']['datasets'] = [
      {
        label: data.series?.[0]?.name ?? options.title ?? 'Data',
        data: points.map((p) => ({ x: p.x, y: p.y })),
        backgroundColor: `${color}99`,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ];

    // Optional trend line (simple linear regression)
    if (points.length >= 2) {
      const n = points.length;
      const sumX = points.reduce((s, p) => s + p.x, 0);
      const sumY = points.reduce((s, p) => s + p.y, 0);
      const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
      const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
      const denom = n * sumX2 - sumX * sumX;

      if (denom !== 0) {
        const slope = (n * sumXY - sumX * sumY) / denom;
        const intercept = (sumY - slope * sumX) / n;
        const xs = points.map((p) => p.x);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);

        datasets.push({
          label: 'Trend',
          data: [
            { x: minX, y: slope * minX + intercept },
            { x: maxX, y: slope * maxX + intercept },
          ],
          borderColor: ECONOMIST_COLORS.target,
          borderWidth: 1.5,
          borderDash: [6, 3],
          pointRadius: 0,
          pointHoverRadius: 0,
          showLine: true,
          fill: false,
          type: 'line' as const,
        } as (typeof datasets)[number]);
      }
    }

    return { datasets };
  }, [data, options]);

  const chartOptions = useMemo(
    () =>
      buildBaseOptions(options, {
        interaction: { mode: 'nearest', intersect: true },
        scales: {
          x: {
            type: 'linear',
            grid: { display: false },
          },
        },
      }) as React.ComponentProps<typeof Scatter>['options'],
    [options],
  );

  return <Scatter data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 10. BubbleChart
// ---------------------------------------------------------------------------
export const BubbleChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const points = data.points ?? [];
    const colors = resolveColors(points.length, options.colorOverrides);

    return {
      datasets: [
        {
          label: options.title ?? 'Data',
          data: points.map((p) => ({
            x: p.x,
            y: p.y,
            r: Math.max(4, Math.min(40, Math.sqrt(Math.abs(p.z ?? 10)) * 3)),
          })),
          backgroundColor: points.map((_, i) => `${colors[i]}88`),
          borderColor: points.map((_, i) => colors[i]),
          borderWidth: 1.5,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () =>
      buildBaseOptions(options, {
        interaction: { mode: 'nearest', intersect: true },
        scales: {
          x: {
            type: 'linear',
            grid: { display: false },
          },
        },
      }) as React.ComponentProps<typeof Bubble>['options'],
    [options],
  );

  return <Bubble data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 11. PieChart
// ---------------------------------------------------------------------------
export const PieChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, values } = singleSeries(data);
    const colors = resolveColors(values.length, options.colorOverrides);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: ECONOMIST_COLORS.background,
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: options.showLegend,
          position: 'right' as const,
          labels: {
            color: ECONOMIST_COLORS.textPrimary,
            font: { size: 11, family: ECONOMIST_FONTS.sans },
            boxWidth: 12,
            padding: 10,
          },
        },
        tooltip: {
          ...CHARTJS_ECONOMIST_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: (ctx: { label?: string; parsed?: number; dataset?: { data?: number[] } }) => {
              const total = (ctx.dataset?.data ?? []).reduce((a: number, b: number) => a + b, 0);
              const pct = total > 0 ? ((ctx.parsed ?? 0) / total * 100).toFixed(1) : '0';
              return `${ctx.label}: ${formatTick(ctx.parsed ?? 0, options.yAxisFormat)} (${pct}%)`;
            },
          },
        },
      },
    }),
    [options],
  );

  return <Pie data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 12. DonutChart
// ---------------------------------------------------------------------------
export const DonutChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, values } = singleSeries(data);
    const colors = resolveColors(values.length, options.colorOverrides);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: ECONOMIST_COLORS.background,
          borderWidth: 2,
          hoverOffset: 6,
          cutout: '55%',
        },
      ],
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: {
          display: options.showLegend,
          position: 'right' as const,
          labels: {
            color: ECONOMIST_COLORS.textPrimary,
            font: { size: 11, family: ECONOMIST_FONTS.sans },
            boxWidth: 12,
            padding: 10,
          },
        },
        tooltip: {
          ...CHARTJS_ECONOMIST_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: (ctx: { label?: string; parsed?: number; dataset?: { data?: number[] } }) => {
              const total = (ctx.dataset?.data ?? []).reduce((a: number, b: number) => a + b, 0);
              const pct = total > 0 ? ((ctx.parsed ?? 0) / total * 100).toFixed(1) : '0';
              return `${ctx.label}: ${formatTick(ctx.parsed ?? 0, options.yAxisFormat)} (${pct}%)`;
            },
          },
        },
      },
    }),
    [options],
  );

  return <Doughnut data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// 13. RadarChart
// ---------------------------------------------------------------------------
export const RadarChart: React.FC<ChartJSChartProps> = ({ data, options, height }) => {
  const chartData = useMemo(() => {
    const { labels, series } = multiSeries(data);
    const colors = resolveColors(
      Math.max(series.length, 1),
      options.colorOverrides,
    );

    // Support single-series via singleSeries fallback
    if (series.length === 0) {
      const { labels: sLabels, values } = singleSeries(data);
      return {
        labels: sLabels,
        datasets: [
          {
            label: options.title ?? 'Data',
            data: values,
            borderColor: colors[0],
            backgroundColor: `${colors[0]}33`,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: colors[0],
          },
        ],
      };
    }

    return {
      labels,
      datasets: series.map((s, i) => ({
        label: s.name,
        data: s.data,
        borderColor: s.color ?? colors[i],
        backgroundColor: `${s.color ?? colors[i]}33`,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: s.color ?? colors[i],
      })),
    };
  }, [data, options]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: options.showLegend,
          labels: {
            color: ECONOMIST_COLORS.textPrimary,
            font: { size: 11, family: ECONOMIST_FONTS.sans },
            boxWidth: 12,
            padding: 12,
          },
        },
        tooltip: {
          ...CHARTJS_ECONOMIST_DEFAULTS.plugins.tooltip,
        },
      },
      scales: {
        r: {
          angleLines: { color: ECONOMIST_COLORS.gridLine },
          grid: { color: ECONOMIST_COLORS.gridLine, lineWidth: 0.8 },
          pointLabels: {
            color: ECONOMIST_COLORS.textSecondary,
            font: { size: 11, family: ECONOMIST_FONTS.sans },
          },
          ticks: {
            color: ECONOMIST_COLORS.axis,
            font: { size: 10, family: ECONOMIST_FONTS.sans },
            backdropColor: 'transparent',
            callback: (value: number | string) => formatTick(value, options.yAxisFormat),
          },
        },
      },
    }),
    [options],
  );

  return <Radar data={chartData} options={chartOptions} height={height ?? options.height} />;
};

// ---------------------------------------------------------------------------
// Renderer mapping
// ---------------------------------------------------------------------------
export const CHARTJS_RENDERERS: Record<string, React.FC<ChartJSChartProps>> = {
  line: LineChart,
  'multi-line': MultiLineChart,
  area: AreaChart,
  'stacked-area': StackedAreaChart,
  bar: BarChart,
  'grouped-bar': GroupedBarChart,
  'stacked-bar': StackedBarChart,
  histogram: HistogramChart,
  scatter: ScatterChart,
  bubble: BubbleChart,
  pie: PieChart,
  donut: DonutChart,
  radar: RadarChart,
};
