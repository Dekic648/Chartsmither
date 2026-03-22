export type ChartCategory =
  | 'line'
  | 'bar'
  | 'horizontal'
  | 'scatter'
  | 'part-to-whole'
  | 'distribution'
  | 'ranking'
  | 'flow'
  | 'map'
  | 'other';

export type ChartTypeId =
  // Chart.js based
  | 'line'
  | 'multi-line'
  | 'area'
  | 'stacked-area'
  | 'bar'
  | 'grouped-bar'
  | 'stacked-bar'
  | 'histogram'
  | 'scatter'
  | 'bubble'
  | 'pie'
  | 'donut'
  | 'radar'
  // Custom SVG
  | 'heatmap'
  | 'treemap'
  | 'lollipop'
  | 'diverging-bar'
  | 'population-pyramid'
  | 'bullet-graph'
  | 'box-plot'
  | 'violin-plot'
  | 'dot-matrix'
  | 'span-chart'
  | 'waterfall'
  | 'radial-bar'
  | 'nightingale-rose'
  | 'proportional-area'
  | 'pictogram'
  | 'word-cloud'
  // Tier 2 — batch 1
  | 'sankey'
  | 'chord'
  | 'sunburst'
  | 'circle-packing'
  | 'tree-diagram'
  // Tier 2 — batch 2
  | 'network-diagram'
  | 'parallel-coordinates'
  | 'stream-graph'
  | 'arc-diagram'
  | 'marimekko'
  // Tier 2 — batch 3
  | 'venn-diagram'
  | 'density-plot'
  | 'gantt'
  | 'timeline'
  | 'error-bars'
  // Tier 3 — advanced
  | 'slope-chart'
  | 'dumbbell-chart'
  | 'waffle-chart'
  | 'bump-chart'
  | 'small-multiples'
  | 'beeswarm'
  // Maps
  | 'choropleth-map'
  | 'bubble-map'
  | 'dot-map'
  | 'connection-map'
  | 'flow-map';

export interface ChartTypeMeta {
  id: ChartTypeId;
  name: string;
  description: string;
  category: ChartCategory;
  engine: 'chartjs' | 'svg';
  dataShape: DataShape;
  icon: string; // SVG path or emoji fallback
}

export type DataShape =
  | 'single-series'      // one array of values + labels
  | 'multi-series'       // multiple named arrays + shared labels
  | 'xy'                 // array of {x, y} points
  | 'xyz'                // array of {x, y, z} points
  | 'matrix'             // 2D grid of values
  | 'hierarchical'       // nested { name, value, children }
  | 'key-value'          // { label: string, value: number }[]
  | 'range'              // { label, min, max }[]
  | 'distribution'       // raw number array for stats
  | 'weighted-text'      // { text, weight }[]
  | 'pyramid'            // { label, left, right }[]
  | 'bullet'             // { label, value, target, ranges }[]
  | 'waterfall'          // { label, value, type: 'increase' | 'decrease' | 'total' }[]
  | 'flow'               // { source, target, value }[]
  | 'network'            // { label, value, connections }[]
  | 'gantt'              // { label, start, end, category? }[]
  | 'timeline-events'    // { label, value (year), description? }[]
  | 'error'              // { label, value, error }[]
  | 'venn'               // { label, value }[] with overlap
  | 'geo';               // { label (country code), value }[]

export interface DataSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  labels?: string[];
  series?: DataSeries[];
  points?: { x: number; y: number; z?: number; label?: string }[];
  matrix?: { rows: string[]; cols: string[]; values: number[][] };
  items?: { label: string; value: number; [key: string]: unknown }[];
  raw?: number[];
}

export interface ChartConfig {
  type: ChartTypeId;
  data: ChartData;
  options: ChartOptions;
}

// ── Chart Gallery (saved charts with unique IDs) ────

export interface SavedChart {
  id: string;
  typeId: ChartTypeId;
  title: string;
  data: ChartData;
  options: ChartOptions;
  savedAt: number;
}

// ── Reports ─────────────────────────────────────────

export interface ReportPage {
  chartId: string;       // SavedChart.id
  chartTypeId: ChartTypeId;
}

export interface Report {
  id: string;
  clientName: string;
  firmName: string;
  title: string;
  date: string;
  preparedBy: string;
  confidentiality: 'confidential' | 'internal' | 'public';
  brandTheme: string;
  pages: ReportPage[];
  createdAt: number;
  updatedAt: number;
}

export interface ReferenceLine {
  axis: 'y' | 'x';
  value: number;
  label: string;
  color: string;
  dashed: boolean;
}

export interface ChartOptions {
  title: string;
  subtitle: string;
  source: string;
  width: number;
  height: number;
  showLegend: boolean;
  showGrid: boolean;
  yAxisLabel: string;
  xAxisLabel: string;
  yAxisFormat: 'number' | 'percent' | 'currency' | 'compact';
  colorOverrides: string[];

  // Phase 1 — Visual polish
  showDataLabels: boolean;
  dataLabelPosition: 'top' | 'center' | 'inside' | 'outside';
  dataLabelFormat: 'value' | 'percent' | 'both';
  footnote: string;
  legendPosition: 'top' | 'bottom' | 'none';
  referenceLines: ReferenceLine[];

  // Theme
  brandTheme: string;

  // Phase 2 — Customization depth
  yAxisMin: number | null;
  yAxisMax: number | null;
  xAxisLabelRotation: 0 | 45 | 90;
  titleFontSize: number;
  subtitleFontSize: number;
  decimalPlaces: number;
  thousandSeparator: boolean;
  currencySymbol: string;
  lineWidth: number;
  pointSize: number;
}

export const DEFAULT_OPTIONS: ChartOptions = {
  title: '',
  subtitle: '',
  source: '',
  width: 620,
  height: 380,
  showLegend: true,
  showGrid: true,
  yAxisLabel: '',
  xAxisLabel: '',
  yAxisFormat: 'number',
  colorOverrides: [],

  // Phase 1
  showDataLabels: false,
  dataLabelPosition: 'top',
  dataLabelFormat: 'value',
  footnote: '',
  legendPosition: 'top',
  referenceLines: [],

  // Theme
  brandTheme: 'economist',

  // Phase 2
  yAxisMin: null,
  yAxisMax: null,
  xAxisLabelRotation: 0,
  titleFontSize: 18,
  subtitleFontSize: 14,
  decimalPlaces: 0,
  thousandSeparator: true,
  currencySymbol: '$',
  lineWidth: 2,
  pointSize: 3,
};
