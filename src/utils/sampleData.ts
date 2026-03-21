import type { ChartTypeId, ChartData } from '../types/chart';

const sampleDataMap: Record<ChartTypeId, ChartData> = {
  // ── Line ──────────────────────────────────────────
  line: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'United States', data: [2.3, -3.4, 5.9, 2.1, 2.5, 2.8] },
    ],
  },

  'multi-line': {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'United States', data: [1.8, 1.2, 4.7, 8.0, 4.1, 2.9] },
      { name: 'United Kingdom', data: [1.8, 0.9, 2.6, 9.1, 6.7, 3.2] },
      { name: 'Germany', data: [1.4, 0.4, 3.2, 8.7, 5.9, 2.4] },
      { name: 'Japan', data: [0.5, 0.0, -0.3, 2.5, 3.3, 2.2] },
    ],
  },

  area: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'Global trade volume, $trn', data: [19.5, 17.6, 22.3, 25.0, 24.0, 25.3] },
    ],
  },

  'stacked-area': {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'Coal', data: [27.0, 25.2, 26.5, 26.7, 26.1, 25.3] },
      { name: 'Natural gas', data: [23.5, 23.2, 24.3, 24.0, 23.8, 23.5] },
      { name: 'Oil', data: [31.2, 28.7, 30.0, 30.5, 30.8, 30.2] },
      { name: 'Renewables', data: [11.4, 12.6, 13.5, 14.8, 16.2, 18.0] },
      { name: 'Nuclear', data: [6.9, 6.8, 6.7, 6.5, 6.5, 6.4] },
    ],
  },

  // ── Bar ───────────────────────────────────────────
  bar: {
    labels: ['United States', 'China', 'Japan', 'Germany', 'India'],
    series: [
      { name: 'GDP, $trn (2024)', data: [27.4, 17.8, 4.2, 4.1, 3.9] },
    ],
  },

  'grouped-bar': {
    labels: ['United States', 'China', 'Germany', 'Japan', 'India'],
    series: [
      { name: '2019', data: [21.4, 14.3, 3.9, 5.1, 2.8] },
      { name: '2024', data: [27.4, 17.8, 4.1, 4.2, 3.9] },
    ],
  },

  'stacked-bar': {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    series: [
      { name: 'Hardware', data: [12.3, 11.8, 13.1, 14.5] },
      { name: 'Software', data: [18.7, 19.5, 20.1, 22.3] },
      { name: 'Services', data: [8.2, 8.9, 9.1, 9.8] },
    ],
  },

  histogram: {
    raw: [
      32000, 34500, 36000, 38200, 39500, 41000, 42300, 43800, 44500, 45200,
      46100, 47000, 47800, 48500, 49200, 50000, 51200, 52500, 53000, 54200,
      55800, 57000, 58500, 60000, 62000, 64500, 67000, 70000, 72500, 75000,
      78000, 82000, 85000, 88000, 92000, 95000, 100000, 105000, 112000, 125000,
      135000, 150000, 175000, 200000, 250000,
    ],
  },

  waterfall: {
    items: [
      { label: 'Starting revenue', value: 420, type: 'total' },
      { label: 'New customers', value: 85, type: 'increase' },
      { label: 'Upsell', value: 42, type: 'increase' },
      { label: 'Churn', value: -63, type: 'decrease' },
      { label: 'Downgrades', value: -18, type: 'decrease' },
      { label: 'Price increases', value: 24, type: 'increase' },
      { label: 'FX impact', value: -12, type: 'decrease' },
      { label: 'Ending revenue', value: 478, type: 'total' },
    ],
  },

  // ── Scatter ───────────────────────────────────────
  scatter: {
    points: [
      { x: 65300, y: 78.5, label: 'United States' },
      { x: 12500, y: 77.3, label: 'China' },
      { x: 39300, y: 84.8, label: 'Japan' },
      { x: 48700, y: 81.3, label: 'Germany' },
      { x: 2400, y: 70.4, label: 'India' },
      { x: 45800, y: 82.2, label: 'United Kingdom' },
      { x: 44900, y: 82.5, label: 'France' },
      { x: 34800, y: 83.4, label: 'South Korea' },
      { x: 51800, y: 83.5, label: 'Australia' },
      { x: 52100, y: 83.6, label: 'Canada' },
      { x: 8900, y: 75.3, label: 'Brazil' },
      { x: 12000, y: 73.4, label: 'Russia' },
      { x: 10200, y: 75.0, label: 'Mexico' },
      { x: 6500, y: 73.3, label: 'Turkey' },
      { x: 31600, y: 83.6, label: 'Spain' },
      { x: 33200, y: 83.4, label: 'Italy' },
      { x: 92000, y: 83.8, label: 'Switzerland' },
      { x: 87100, y: 82.7, label: 'Norway' },
      { x: 3400, y: 72.4, label: 'Indonesia' },
      { x: 6600, y: 77.1, label: 'Thailand' },
    ],
  },

  bubble: {
    points: [
      { x: 65300, y: 78.5, z: 333, label: 'United States' },
      { x: 12500, y: 77.3, z: 1412, label: 'China' },
      { x: 39300, y: 84.8, z: 125, label: 'Japan' },
      { x: 48700, y: 81.3, z: 84, label: 'Germany' },
      { x: 2400, y: 70.4, z: 1408, label: 'India' },
      { x: 45800, y: 82.2, z: 68, label: 'United Kingdom' },
      { x: 8900, y: 75.3, z: 214, label: 'Brazil' },
      { x: 3400, y: 72.4, z: 276, label: 'Indonesia' },
      { x: 1600, y: 62.5, z: 220, label: 'Nigeria' },
      { x: 12000, y: 73.4, z: 144, label: 'Russia' },
    ],
  },

  // ── Part-to-whole ─────────────────────────────────
  pie: {
    items: [
      { label: 'Asia-Pacific', value: 38.3 },
      { label: 'Europe', value: 23.8 },
      { label: 'North America', value: 26.1 },
      { label: 'Latin America', value: 5.8 },
      { label: 'Middle East & Africa', value: 6.0 },
    ],
  },

  donut: {
    items: [
      { label: 'Equities', value: 42 },
      { label: 'Fixed income', value: 28 },
      { label: 'Real estate', value: 12 },
      { label: 'Alternatives', value: 10 },
      { label: 'Cash', value: 8 },
    ],
  },

  treemap: {
    items: [
      { label: 'Technology', value: 12800 },
      { label: 'Healthcare', value: 7200 },
      { label: 'Financials', value: 8100 },
      { label: 'Consumer discretionary', value: 5400 },
      { label: 'Industrials', value: 4900 },
      { label: 'Communication', value: 4300 },
      { label: 'Consumer staples', value: 3800 },
      { label: 'Energy', value: 3200 },
      { label: 'Utilities', value: 1700 },
      { label: 'Materials', value: 1500 },
      { label: 'Real estate', value: 1100 },
    ],
  },

  // ── Ranking / Horizontal ──────────────────────────
  lollipop: {
    items: [
      { label: 'Singapore', value: 97.5 },
      { label: 'Denmark', value: 93.2 },
      { label: 'New Zealand', value: 91.4 },
      { label: 'Switzerland', value: 90.8 },
      { label: 'Finland', value: 89.9 },
      { label: 'Sweden', value: 88.3 },
      { label: 'Norway', value: 87.1 },
      { label: 'Netherlands', value: 86.4 },
      { label: 'Germany', value: 84.7 },
      { label: 'Ireland', value: 83.1 },
    ],
  },

  'diverging-bar': {
    items: [
      { label: 'Economy', left: 38, right: 52 },
      { label: 'Healthcare', left: 45, right: 42 },
      { label: 'Immigration', left: 28, right: 61 },
      { label: 'Climate', left: 62, right: 24 },
      { label: 'Education', left: 48, right: 40 },
      { label: 'Defence', left: 32, right: 55 },
      { label: 'Taxation', left: 55, right: 35 },
    ],
  },

  'population-pyramid': {
    items: [
      { label: '0-9', left: 5.8, right: 5.5 },
      { label: '10-19', left: 6.2, right: 5.9 },
      { label: '20-29', left: 6.8, right: 6.5 },
      { label: '30-39', left: 6.9, right: 6.7 },
      { label: '40-49', left: 6.2, right: 6.1 },
      { label: '50-59', left: 6.5, right: 6.6 },
      { label: '60-69', left: 6.1, right: 6.5 },
      { label: '70-79', left: 4.2, right: 4.9 },
      { label: '80+', left: 2.1, right: 3.2 },
    ],
  },

  // ── Distribution ──────────────────────────────────
  'box-plot': {
    raw: [
      28, 30, 31, 32, 33, 33, 34, 34, 35, 35, 36, 36, 36, 37, 37, 37, 38,
      38, 38, 38, 39, 39, 39, 40, 40, 40, 41, 41, 41, 42, 42, 43, 43, 44,
      44, 45, 46, 47, 48, 50, 52, 55, 58, 62, 68,
    ],
  },

  'violin-plot': {
    raw: [
      22, 24, 25, 26, 27, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30, 31,
      31, 31, 31, 31, 32, 32, 32, 32, 33, 33, 33, 33, 33, 34, 34, 34, 34,
      35, 35, 35, 36, 36, 37, 37, 38, 39, 40, 42, 44, 47, 50,
    ],
  },

  // ── Other ─────────────────────────────────────────
  radar: {
    labels: ['Growth', 'Profitability', 'Leverage', 'Liquidity', 'Efficiency', 'Valuation'],
    series: [
      { name: 'Company A', data: [82, 74, 65, 88, 71, 60] },
      { name: 'Industry median', data: [55, 62, 70, 60, 58, 68] },
    ],
  },

  heatmap: {
    matrix: {
      rows: ['GDP growth', 'Inflation', 'Unemployment', 'Interest rate', 'Trade balance', 'Debt/GDP'],
      cols: ['GDP growth', 'Inflation', 'Unemployment', 'Interest rate', 'Trade balance', 'Debt/GDP'],
      values: [
        [1.00, -0.32, -0.68, 0.15, 0.42, -0.21],
        [-0.32, 1.00, 0.25, 0.78, -0.35, 0.44],
        [-0.68, 0.25, 1.00, -0.12, -0.55, 0.61],
        [0.15, 0.78, -0.12, 1.00, -0.18, 0.33],
        [0.42, -0.35, -0.55, -0.18, 1.00, -0.47],
        [-0.21, 0.44, 0.61, 0.33, -0.47, 1.00],
      ],
    },
  },

  'bullet-graph': {
    items: [
      { label: 'Revenue', value: 275, target: 250, ranges: [150, 200, 300] },
      { label: 'Profit', value: 22, target: 26, ranges: [10, 18, 30] },
      { label: 'Orders', value: 1450, target: 1200, ranges: [800, 1100, 1600] },
      { label: 'NPS', value: 68, target: 72, ranges: [30, 55, 80] },
    ],
  },

  'dot-matrix': {
    items: [
      { label: 'Employed', value: 62 },
      { label: 'Unemployed', value: 4 },
      { label: 'Not in labour force', value: 34 },
    ],
  },

  'span-chart': {
    items: [
      { label: 'London', value: 0, min: 5, max: 23 },
      { label: 'New York', value: 0, min: -1, max: 30 },
      { label: 'Tokyo', value: 0, min: 2, max: 31 },
      { label: 'Sydney', value: 0, min: 9, max: 27 },
      { label: 'Moscow', value: 0, min: -10, max: 24 },
      { label: 'Dubai', value: 0, min: 15, max: 42 },
      { label: 'Singapore', value: 0, min: 24, max: 32 },
    ],
  },

  'radial-bar': {
    items: [
      { label: 'Clean energy', value: 78 },
      { label: 'Water access', value: 91 },
      { label: 'Education', value: 85 },
      { label: 'Healthcare', value: 72 },
      { label: 'Digital infra', value: 64 },
      { label: 'Food security', value: 68 },
    ],
  },

  'nightingale-rose': {
    items: [
      { label: 'Jan', value: 42 },
      { label: 'Feb', value: 38 },
      { label: 'Mar', value: 65 },
      { label: 'Apr', value: 78 },
      { label: 'May', value: 92 },
      { label: 'Jun', value: 105 },
      { label: 'Jul', value: 118 },
      { label: 'Aug', value: 112 },
      { label: 'Sep', value: 87 },
      { label: 'Oct', value: 63 },
      { label: 'Nov', value: 48 },
      { label: 'Dec', value: 35 },
    ],
  },

  'proportional-area': {
    items: [
      { label: 'United States', value: 27400 },
      { label: 'China', value: 17800 },
      { label: 'Japan', value: 4200 },
      { label: 'Germany', value: 4100 },
      { label: 'India', value: 3900 },
    ],
  },

  pictogram: {
    items: [
      { label: 'Vaccinated', value: 73 },
      { label: 'Partially', value: 12 },
      { label: 'Unvaccinated', value: 15 },
    ],
  },

  'word-cloud': {
    items: [
      { label: 'inflation', value: 95 },
      { label: 'recession', value: 82 },
      { label: 'interest rates', value: 78 },
      { label: 'growth', value: 72 },
      { label: 'employment', value: 68 },
      { label: 'trade', value: 64 },
      { label: 'fiscal policy', value: 60 },
      { label: 'central bank', value: 58 },
      { label: 'deficit', value: 55 },
      { label: 'supply chain', value: 52 },
      { label: 'productivity', value: 48 },
      { label: 'inequality', value: 45 },
      { label: 'debt', value: 44 },
      { label: 'tariffs', value: 42 },
      { label: 'globalisation', value: 40 },
      { label: 'monetary policy', value: 38 },
      { label: 'stimulus', value: 35 },
      { label: 'wages', value: 33 },
      { label: 'housing', value: 31 },
      { label: 'energy', value: 30 },
      { label: 'currency', value: 28 },
      { label: 'bonds', value: 26 },
      { label: 'equities', value: 24 },
      { label: 'commodities', value: 22 },
      { label: 'sanctions', value: 20 },
    ],
  },

  // ── Tier 2 — Batch 1 ────────────────────────────
  sankey: {
    items: [
      { label: 'Coal-Electricity', source: 'Coal', target: 'Electricity', value: 25 },
      { label: 'Coal-Industry', source: 'Coal', target: 'Industry', value: 12 },
      { label: 'Gas-Electricity', source: 'Natural Gas', target: 'Electricity', value: 18 },
      { label: 'Gas-Heating', source: 'Natural Gas', target: 'Heating', value: 14 },
      { label: 'Gas-Industry', source: 'Natural Gas', target: 'Industry', value: 8 },
      { label: 'Oil-Transport', source: 'Oil', target: 'Transport', value: 32 },
      { label: 'Oil-Industry', source: 'Oil', target: 'Industry', value: 10 },
      { label: 'Nuclear-Electricity', source: 'Nuclear', target: 'Electricity', value: 11 },
      { label: 'Renewables-Electricity', source: 'Renewables', target: 'Electricity', value: 15 },
      { label: 'Renewables-Heating', source: 'Renewables', target: 'Heating', value: 4 },
    ],
  },

  chord: {
    matrix: {
      rows: ['US', 'China', 'EU', 'Japan', 'UK'],
      cols: ['US', 'China', 'EU', 'Japan', 'UK'],
      values: [
        [0, 580, 720, 210, 130],
        [510, 0, 490, 180, 75],
        [680, 460, 0, 95, 310],
        [195, 165, 88, 0, 42],
        [120, 68, 290, 38, 0],
      ],
    },
  },

  sunburst: {
    items: [
      { label: 'Technology', value: 35, children: [
        { label: 'Software', value: 20 },
        { label: 'Hardware', value: 10 },
        { label: 'Semiconductors', value: 5 },
      ] },
      { label: 'Healthcare', value: 15, children: [
        { label: 'Pharma', value: 8 },
        { label: 'Biotech', value: 4 },
        { label: 'Medical Devices', value: 3 },
      ] },
      { label: 'Financials', value: 13, children: [
        { label: 'Banks', value: 6 },
        { label: 'Insurance', value: 4 },
        { label: 'Asset Management', value: 3 },
      ] },
      { label: 'Consumer', value: 12, children: [
        { label: 'Retail', value: 5 },
        { label: 'Automotive', value: 4 },
        { label: 'Apparel', value: 3 },
      ] },
      { label: 'Energy', value: 8, children: [
        { label: 'Oil & Gas', value: 5 },
        { label: 'Renewables', value: 3 },
      ] },
      { label: 'Industrials', value: 9, children: [
        { label: 'Aerospace', value: 4 },
        { label: 'Machinery', value: 3 },
        { label: 'Construction', value: 2 },
      ] },
      { label: 'Other', value: 8, children: [
        { label: 'Utilities', value: 3 },
        { label: 'Materials', value: 3 },
        { label: 'Real Estate', value: 2 },
      ] },
    ],
  },

  'circle-packing': {
    items: [
      { label: 'Defence', value: 2100, children: [
        { label: 'US Defence', value: 886 },
        { label: 'China Defence', value: 292 },
        { label: 'EU Defence', value: 280 },
        { label: 'Other Defence', value: 642 },
      ] },
      { label: 'Healthcare', value: 1800, children: [
        { label: 'US Healthcare', value: 820 },
        { label: 'EU Healthcare', value: 540 },
        { label: 'China Healthcare', value: 240 },
        { label: 'Other Healthcare', value: 200 },
      ] },
      { label: 'Education', value: 1300, children: [
        { label: 'US Education', value: 380 },
        { label: 'EU Education', value: 420 },
        { label: 'China Education', value: 310 },
        { label: 'Other Education', value: 190 },
      ] },
      { label: 'Infrastructure', value: 900, children: [
        { label: 'US Infra', value: 210 },
        { label: 'China Infra', value: 340 },
        { label: 'EU Infra', value: 200 },
        { label: 'Other Infra', value: 150 },
      ] },
      { label: 'R&D', value: 700, children: [
        { label: 'US R&D', value: 280 },
        { label: 'China R&D', value: 180 },
        { label: 'EU R&D', value: 160 },
        { label: 'Other R&D', value: 80 },
      ] },
    ],
  },

  'tree-diagram': {
    items: [
      { label: 'CEO', value: 1, children: [
        { label: 'CFO', value: 1, children: [
          { label: 'Accounting', value: 1 },
          { label: 'Treasury', value: 1 },
          { label: 'FP&A', value: 1 },
        ] },
        { label: 'COO', value: 1, children: [
          { label: 'Manufacturing', value: 1 },
          { label: 'Supply Chain', value: 1 },
          { label: 'Quality', value: 1 },
        ] },
        { label: 'CTO', value: 1, children: [
          { label: 'Engineering', value: 1 },
          { label: 'Product', value: 1 },
          { label: 'Data Science', value: 1 },
        ] },
        { label: 'CMO', value: 1, children: [
          { label: 'Brand', value: 1 },
          { label: 'Digital Marketing', value: 1 },
        ] },
      ] },
    ],
  },

  // ── Tier 2 — Batch 2 ────────────────────────────
  'network-diagram': {
    items: [
      { label: 'US', value: 100, connections: ['UK', 'Canada', 'Mexico', 'Japan', 'Germany'] },
      { label: 'UK', value: 65, connections: ['US', 'Germany', 'France', 'India'] },
      { label: 'Germany', value: 70, connections: ['US', 'UK', 'France', 'China'] },
      { label: 'China', value: 90, connections: ['US', 'Japan', 'South Korea', 'Germany', 'Australia'] },
      { label: 'Japan', value: 55, connections: ['US', 'China', 'South Korea'] },
      { label: 'France', value: 50, connections: ['UK', 'Germany', 'Spain'] },
      { label: 'Canada', value: 45, connections: ['US', 'UK'] },
      { label: 'India', value: 60, connections: ['UK', 'US', 'UAE'] },
      { label: 'Mexico', value: 40, connections: ['US', 'Canada'] },
      { label: 'South Korea', value: 48, connections: ['China', 'Japan', 'US'] },
      { label: 'Australia', value: 38, connections: ['China', 'Japan'] },
      { label: 'Spain', value: 30, connections: ['France', 'UK'] },
      { label: 'UAE', value: 35, connections: ['India', 'UK'] },
    ],
  },

  'parallel-coordinates': {
    matrix: {
      rows: ['Norway', 'Switzerland', 'Australia', 'Germany', 'United States', 'Japan', 'Brazil', 'China', 'India', 'Nigeria'],
      cols: ['GDP per capita ($k)', 'HDI', 'Life expectancy', 'Literacy (%)', 'CO2 (tonnes/cap)'],
      values: [
        [87.1, 0.961, 83.2, 99, 7.5],
        [92.0, 0.962, 83.4, 99, 4.0],
        [51.8, 0.951, 83.5, 99, 15.0],
        [48.7, 0.942, 81.3, 99, 7.9],
        [65.3, 0.921, 78.5, 99, 14.4],
        [39.3, 0.920, 84.8, 99, 8.5],
        [8.9, 0.760, 75.3, 93, 2.0],
        [12.5, 0.768, 77.3, 97, 7.4],
        [2.4, 0.644, 70.4, 74, 1.9],
        [1.6, 0.539, 62.5, 62, 0.6],
      ],
    },
  },

  'stream-graph': {
    labels: ['1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020'],
    series: [
      { name: 'Rock', data: [35, 40, 42, 38, 34, 28, 22, 18, 14, 11, 9] },
      { name: 'Pop', data: [25, 22, 20, 24, 28, 32, 35, 30, 28, 26, 24] },
      { name: 'Hip-Hop', data: [1, 2, 4, 8, 14, 18, 22, 28, 30, 34, 36] },
      { name: 'Electronic', data: [2, 3, 5, 7, 8, 12, 16, 20, 22, 20, 18] },
      { name: 'Country', data: [12, 11, 10, 10, 9, 8, 8, 9, 10, 10, 9] },
      { name: 'R&B', data: [15, 14, 13, 11, 10, 10, 9, 8, 7, 6, 5] },
    ],
  },

  'arc-diagram': {
    items: [
      { label: 'Python', value: 80, connections: ['JavaScript', 'R', 'C++', 'Java'] },
      { label: 'JavaScript', value: 75, connections: ['Python', 'TypeScript', 'Java'] },
      { label: 'TypeScript', value: 55, connections: ['JavaScript', 'Python'] },
      { label: 'Java', value: 60, connections: ['JavaScript', 'Python', 'Kotlin', 'C++'] },
      { label: 'C++', value: 45, connections: ['Python', 'Java', 'Rust', 'C'] },
      { label: 'R', value: 30, connections: ['Python'] },
      { label: 'Rust', value: 35, connections: ['C++', 'Go'] },
      { label: 'Go', value: 40, connections: ['Rust', 'Python'] },
      { label: 'Kotlin', value: 28, connections: ['Java'] },
      { label: 'C', value: 38, connections: ['C++'] },
    ],
  },

  marimekko: {
    labels: ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'MEA'],
    series: [
      { name: 'Smartphones', data: [38, 32, 45, 28, 22] },
      { name: 'Laptops', data: [28, 30, 22, 18, 12] },
      { name: 'Tablets', data: [18, 16, 14, 10, 8] },
      { name: 'Wearables', data: [16, 22, 19, 8, 5] },
    ],
  },

  // ── Tier 2 — Batch 3 ────────────────────────────
  'venn-diagram': {
    items: [
      { label: 'Data Science', value: 45 },
      { label: 'Software Engineering', value: 55 },
      { label: 'Domain Expertise', value: 40 },
      { label: 'DS ∩ SWE', value: 20 },
      { label: 'DS ∩ Domain', value: 15 },
      { label: 'SWE ∩ Domain', value: 12 },
      { label: 'DS ∩ SWE ∩ Domain', value: 8 },
    ],
  },

  'density-plot': {
    raw: [
      18200, 19800, 21500, 22100, 23400, 24000, 24800, 25200, 25900, 26500,
      27100, 27800, 28400, 29000, 29500, 30100, 30800, 31200, 31800, 32400,
      33000, 33500, 34100, 34600, 35200, 35800, 36300, 36900, 37400, 38000,
      38500, 39100, 39600, 40200, 40800, 41300, 41900, 42400, 43000, 43500,
      44100, 44600, 45200, 45800, 46300, 46900, 47400, 48000, 48500, 49100,
      49800, 50400, 51000, 51700, 52300, 53000, 53800, 54500, 55300, 56100,
      57000, 57900, 58800, 59800, 60800, 61900, 63000, 64200, 65500, 66900,
      68400, 70000, 71800, 73700, 75800, 78100, 80600, 83400, 86500, 90000,
      93900, 98200, 103200, 108800, 115200, 122500, 130800, 140500, 151800,
      165000, 180500, 199000, 221000, 248000, 282000, 325000, 380000, 452000,
      550000, 720000,
    ],
  },

  gantt: {
    items: [
      { label: 'Research', value: 0, start: 0, end: 3, category: 'Planning' },
      { label: 'Requirements', value: 0, start: 1, end: 4, category: 'Planning' },
      { label: 'Architecture', value: 0, start: 3, end: 5, category: 'Design' },
      { label: 'UI Design', value: 0, start: 4, end: 7, category: 'Design' },
      { label: 'Backend Dev', value: 0, start: 5, end: 10, category: 'Development' },
      { label: 'Frontend Dev', value: 0, start: 6, end: 11, category: 'Development' },
      { label: 'API Integration', value: 0, start: 8, end: 11, category: 'Development' },
      { label: 'Unit Testing', value: 0, start: 9, end: 12, category: 'Testing' },
      { label: 'QA Testing', value: 0, start: 11, end: 14, category: 'Testing' },
      { label: 'Beta Release', value: 0, start: 14, end: 15, category: 'Launch' },
      { label: 'Production Launch', value: 0, start: 15, end: 16, category: 'Launch' },
    ],
  },

  timeline: {
    items: [
      { label: 'First iPhone launched', value: 2007, description: 'Apple revolutionizes the smartphone market' },
      { label: 'iPad introduced', value: 2010, description: 'Apple creates the modern tablet category' },
      { label: 'Alexa / Echo launched', value: 2014, description: 'Amazon brings voice assistants to homes' },
      { label: 'AlphaGo beats world champion', value: 2016, description: 'DeepMind AI defeats Lee Sedol at Go' },
      { label: 'GPT-3 released', value: 2020, description: 'OpenAI demonstrates large language model capabilities' },
      { label: 'ChatGPT launched', value: 2022, description: 'Conversational AI reaches mainstream adoption' },
      { label: 'Apple Vision Pro ships', value: 2024, description: 'Spatial computing enters the consumer market' },
      { label: 'Claude Opus 4 released', value: 2025, description: 'Anthropic ships frontier reasoning model' },
    ],
  },

  'error-bars': {
    items: [
      { label: 'Treatment A', value: 45, error: 8 },
      { label: 'Treatment B', value: 52, error: 6 },
      { label: 'Treatment C', value: 38, error: 11 },
      { label: 'Treatment D', value: 61, error: 5 },
      { label: 'Placebo', value: 28, error: 9 },
      { label: 'Treatment E', value: 55, error: 7 },
    ],
  },

  // ── Maps ─────────────────────────────────────────
  'choropleth-map': {
    items: [
      { label: 'US', value: 63544 },
      { label: 'GB', value: 42300 },
      { label: 'DE', value: 48700 },
      { label: 'FR', value: 44900 },
      { label: 'JP', value: 39300 },
      { label: 'CN', value: 12500 },
      { label: 'IN', value: 2400 },
      { label: 'BR', value: 8900 },
      { label: 'CA', value: 52100 },
      { label: 'AU', value: 51800 },
      { label: 'KR', value: 34800 },
      { label: 'NO', value: 87100 },
      { label: 'CH', value: 92000 },
      { label: 'MX', value: 10200 },
      { label: 'NG', value: 1600 },
    ],
  },

  'bubble-map': {
    items: [
      { label: 'CN', value: 1412 },
      { label: 'IN', value: 1408 },
      { label: 'US', value: 333 },
      { label: 'ID', value: 276 },
      { label: 'PK', value: 230 },
      { label: 'NG', value: 220 },
      { label: 'BR', value: 214 },
      { label: 'BD', value: 170 },
      { label: 'RU', value: 144 },
      { label: 'MX', value: 128 },
      { label: 'JP', value: 125 },
      { label: 'ET', value: 120 },
      { label: 'PH', value: 114 },
      { label: 'EG', value: 105 },
      { label: 'DE', value: 84 },
    ],
  },

  'dot-map': {
    items: [
      { label: 'US', value: 8 },
      { label: 'CN', value: 6 },
      { label: 'GB', value: 4 },
      { label: 'IN', value: 4 },
      { label: 'DE', value: 3 },
      { label: 'IL', value: 3 },
      { label: 'JP', value: 3 },
      { label: 'SG', value: 2 },
      { label: 'KR', value: 2 },
      { label: 'CA', value: 2 },
      { label: 'FR', value: 2 },
      { label: 'SE', value: 1 },
      { label: 'AU', value: 1 },
      { label: 'EE', value: 1 },
    ],
  },

  'connection-map': {
    items: [
      { label: 'US-GB', source: 'US', target: 'GB', value: 273 },
      { label: 'US-CN', source: 'US', target: 'CN', value: 580 },
      { label: 'US-JP', source: 'US', target: 'JP', value: 210 },
      { label: 'US-DE', source: 'US', target: 'DE', value: 195 },
      { label: 'US-CA', source: 'US', target: 'CA', value: 680 },
      { label: 'US-MX', source: 'US', target: 'MX', value: 620 },
      { label: 'CN-JP', source: 'CN', target: 'JP', value: 165 },
      { label: 'CN-KR', source: 'CN', target: 'KR', value: 180 },
      { label: 'DE-FR', source: 'DE', target: 'FR', value: 155 },
      { label: 'GB-DE', source: 'GB', target: 'DE', value: 130 },
    ],
  },

  'flow-map': {
    items: [
      { label: 'MX-US', source: 'MX', target: 'US', value: 850 },
      { label: 'IN-UAE', source: 'IN', target: 'AE', value: 320 },
      { label: 'SY-DE', source: 'SY', target: 'DE', value: 280 },
      { label: 'PH-US', source: 'PH', target: 'US', value: 190 },
      { label: 'UA-PL', source: 'UA', target: 'PL', value: 260 },
      { label: 'VE-CO', source: 'VE', target: 'CO', value: 210 },
      { label: 'BD-IN', source: 'BD', target: 'IN', value: 175 },
      { label: 'CN-CA', source: 'CN', target: 'CA', value: 145 },
      { label: 'TR-DE', source: 'TR', target: 'DE', value: 160 },
      { label: 'RO-IT', source: 'RO', target: 'IT', value: 130 },
    ],
  },
};

export function getSampleData(chartTypeId: ChartTypeId): ChartData {
  const data = sampleDataMap[chartTypeId];
  if (!data) {
    return { labels: ['A', 'B', 'C'], series: [{ name: 'Value', data: [10, 20, 30] }] };
  }
  // Return a deep copy so callers can mutate freely
  return JSON.parse(JSON.stringify(data));
}
