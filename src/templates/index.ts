import type { ChartTypeId, ChartData, ChartOptions } from '../types/chart';

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'economics' | 'survey' | 'science' | 'editorial';
  chartType: ChartTypeId;
  data: ChartData;
  options: Partial<ChartOptions>;
  preview: string; // emoji for quick display
}

// ═══════════════════════════════════════════════════════════════
//  BUSINESS TEMPLATES
// ═══════════════════════════════════════════════════════════════

const quarterlyRevenueBridge: ChartTemplate = {
  id: 'quarterly-revenue-bridge',
  name: 'Quarterly Revenue Bridge',
  description: 'Walk from Q1 opening revenue through each driver to Q4 closing. Classic CFO storytelling format.',
  category: 'business',
  chartType: 'waterfall',
  preview: '\u{1FA9C}',
  data: {
    items: [
      { label: 'Q1 Revenue', value: 842, type: 'total' },
      { label: 'Volume growth', value: 64, type: 'increase' },
      { label: 'Price increases', value: 38, type: 'increase' },
      { label: 'New product lines', value: 27, type: 'increase' },
      { label: 'Customer churn', value: -51, type: 'decrease' },
      { label: 'FX headwinds', value: -19, type: 'decrease' },
      { label: 'Discounting', value: -14, type: 'decrease' },
      { label: 'Q4 Revenue', value: 887, type: 'total' },
    ],
  },
  options: {
    title: 'Revenue bridge FY 2024',
    subtitle: 'Q1 opening to Q4 closing revenue, $m',
    source: 'Source: Company filings',
    yAxisFormat: 'number',
  },
};

const marketShareComparison: ChartTemplate = {
  id: 'market-share-comparison',
  name: 'Market Share Comparison',
  description: 'Global smartphone market share by manufacturer. Donut with clean labels.',
  category: 'business',
  chartType: 'donut',
  preview: '\u{1F4F1}',
  data: {
    items: [
      { label: 'Apple', value: 23.3 },
      { label: 'Samsung', value: 19.4 },
      { label: 'Xiaomi', value: 12.8 },
      { label: 'Oppo', value: 8.6 },
      { label: 'Others', value: 35.9 },
    ],
  },
  options: {
    title: 'Global smartphone market share',
    subtitle: 'Shipments by manufacturer, Q3 2024, %',
    source: 'Source: IDC Quarterly Mobile Phone Tracker',
  },
};

const salesByRegion: ChartTemplate = {
  id: 'sales-by-region',
  name: 'Sales by Region',
  description: 'Four regions across four quarters. Spot seasonal patterns and regional divergence.',
  category: 'business',
  chartType: 'grouped-bar',
  preview: '\u{1F30D}',
  data: {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    series: [
      { name: 'North America', data: [148, 162, 155, 189] },
      { name: 'Europe', data: [112, 108, 96, 131] },
      { name: 'Asia-Pacific', data: [94, 105, 118, 127] },
      { name: 'Latin America', data: [38, 42, 45, 51] },
    ],
  },
  options: {
    title: 'Regional sales performance',
    subtitle: 'Quarterly revenue by region, $m',
    source: 'Source: Internal reporting',
    yAxisFormat: 'number',
    yAxisLabel: 'Revenue ($m)',
  },
};

const kpiDashboard: ChartTemplate = {
  id: 'kpi-dashboard',
  name: 'KPI Dashboard',
  description: 'Four key business metrics vs targets with qualitative ranges. Instant health check.',
  category: 'business',
  chartType: 'bullet-graph',
  preview: '\u{1F3AF}',
  data: {
    items: [
      { label: 'Revenue ($m)', value: 887, target: 850, ranges: [600, 750, 950] },
      { label: 'EBITDA margin (%)', value: 24.2, target: 26, ranges: [15, 22, 30] },
      { label: 'Net Promoter Score', value: 62, target: 70, ranges: [30, 50, 80] },
      { label: 'Employee retention (%)', value: 91, target: 93, ranges: [80, 88, 98] },
    ],
  },
  options: {
    title: 'Q4 2024 KPI scorecard',
    subtitle: 'Actual vs target with poor / satisfactory / good ranges',
    source: 'Source: Management reporting',
  },
};

const growthVsProfitability: ChartTemplate = {
  id: 'growth-vs-profitability',
  name: 'Growth vs Profitability',
  description: 'Plot companies by revenue growth and EBITDA margin. Identify the "Rule of 40" winners.',
  category: 'business',
  chartType: 'scatter',
  preview: '\u{1F4C8}',
  data: {
    points: [
      { x: 28, y: 34, label: 'Microsoft' },
      { x: 12, y: 45, label: 'Apple' },
      { x: 23, y: 22, label: 'Alphabet' },
      { x: 18, y: 38, label: 'Meta' },
      { x: 31, y: -2, label: 'Amazon' },
      { x: 52, y: 11, label: 'Nvidia' },
      { x: 9, y: 28, label: 'Oracle' },
      { x: 26, y: 18, label: 'Salesforce' },
      { x: 15, y: 31, label: 'Adobe' },
      { x: 35, y: -8, label: 'CrowdStrike' },
      { x: 42, y: -5, label: 'Datadog' },
      { x: 22, y: 25, label: 'ServiceNow' },
      { x: 8, y: 41, label: 'Visa' },
      { x: 6, y: 52, label: 'Mastercard' },
      { x: 38, y: 3, label: 'Snowflake' },
    ],
  },
  options: {
    title: 'Growth vs profitability in Big Tech',
    subtitle: 'Revenue growth (%) vs EBITDA margin (%), trailing twelve months',
    source: 'Source: Company filings, Bloomberg',
    xAxisLabel: 'Revenue growth (%)',
    yAxisLabel: 'EBITDA margin (%)',
  },
};

// ═══════════════════════════════════════════════════════════════
//  ECONOMICS TEMPLATES
// ═══════════════════════════════════════════════════════════════

const gdpGrowthComparison: ChartTemplate = {
  id: 'gdp-growth-comparison',
  name: 'GDP Growth Comparison',
  description: 'G7 economies 2019-2024. The pandemic shock and divergent recoveries at a glance.',
  category: 'economics',
  chartType: 'multi-line',
  preview: '\u{1F4C9}',
  data: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'United States', data: [2.3, -3.4, 5.9, 2.1, 2.5, 2.8] },
      { name: 'Germany', data: [1.1, -3.7, 3.2, 1.8, -0.3, 0.2] },
      { name: 'United Kingdom', data: [1.4, -11.0, 7.6, 4.1, 0.1, 0.7] },
      { name: 'Japan', data: [0.7, -4.3, 2.1, 1.0, 1.9, 0.4] },
      { name: 'France', data: [1.8, -7.9, 6.8, 2.5, 0.9, 1.1] },
      { name: 'Italy', data: [0.5, -9.0, 7.0, 3.7, 0.9, 0.7] },
      { name: 'Canada', data: [1.9, -5.2, 5.0, 3.4, 1.1, 1.3] },
    ],
  },
  options: {
    title: 'The great divergence',
    subtitle: 'Real GDP growth (% y/y) across G7 economies, 2019-2024',
    source: 'Source: IMF World Economic Outlook, October 2024',
    yAxisFormat: 'number',
    yAxisLabel: 'GDP growth (%)',
  },
};

const tradeBalance: ChartTemplate = {
  id: 'trade-balance',
  name: 'Trade Balance',
  description: 'US trade balance with major partners. Surpluses right, deficits left.',
  category: 'economics',
  chartType: 'diverging-bar',
  preview: '\u{26F5}',
  data: {
    items: [
      { label: 'China', value: 0, left: 279, right: 0 },
      { label: 'EU', value: 0, left: 208, right: 0 },
      { label: 'Mexico', value: 0, left: 152, right: 0 },
      { label: 'Vietnam', value: 0, left: 104, right: 0 },
      { label: 'Japan', value: 0, left: 68, right: 0 },
      { label: 'South Korea', value: 0, left: 44, right: 0 },
      { label: 'Canada', value: 0, left: 36, right: 0 },
      { label: 'Brazil', value: 0, left: 0, right: 11 },
      { label: 'Netherlands', value: 0, left: 0, right: 27 },
      { label: 'Australia', value: 0, left: 0, right: 18 },
    ],
  },
  options: {
    title: 'America\'s trade imbalances',
    subtitle: 'US bilateral goods trade balance, 2024, $bn. Left = deficit, right = surplus',
    source: 'Source: US Census Bureau',
  },
};

const inflationVsInterestRates: ChartTemplate = {
  id: 'inflation-vs-interest-rates',
  name: 'Inflation vs Interest Rates',
  description: '20 countries plotted by CPI and policy rate. Are central banks ahead or behind the curve?',
  category: 'economics',
  chartType: 'scatter',
  preview: '\u{1F3E6}',
  data: {
    points: [
      { x: 2.9, y: 5.25, label: 'United States' },
      { x: 2.6, y: 4.50, label: 'Eurozone' },
      { x: 2.3, y: 5.00, label: 'United Kingdom' },
      { x: 2.8, y: 0.25, label: 'Japan' },
      { x: 2.0, y: 4.50, label: 'Canada' },
      { x: 3.5, y: 4.35, label: 'Australia' },
      { x: 0.3, y: 3.45, label: 'China' },
      { x: 4.8, y: 13.75, label: 'Brazil' },
      { x: 5.1, y: 10.50, label: 'India' },
      { x: 3.5, y: 6.50, label: 'Mexico' },
      { x: 4.4, y: 8.50, label: 'South Africa' },
      { x: 65.0, y: 50.0, label: 'Turkey' },
      { x: 8.6, y: 19.0, label: 'Russia' },
      { x: 3.4, y: 6.00, label: 'Indonesia' },
      { x: 2.7, y: 3.50, label: 'South Korea' },
      { x: 3.2, y: 2.50, label: 'Sweden' },
      { x: 1.6, y: 1.75, label: 'Switzerland' },
      { x: 2.2, y: 4.50, label: 'Norway' },
      { x: 1.8, y: 5.25, label: 'New Zealand' },
      { x: 2.8, y: 2.65, label: 'Thailand' },
    ],
  },
  options: {
    title: 'Inflation vs policy rates worldwide',
    subtitle: 'CPI inflation (% y/y) vs central bank policy rate (%), Q3 2024',
    source: 'Source: National central banks, IMF',
    xAxisLabel: 'CPI inflation (%)',
    yAxisLabel: 'Policy rate (%)',
  },
};

const incomeDistribution: ChartTemplate = {
  id: 'income-distribution',
  name: 'Income Distribution',
  description: 'US household income distribution. The familiar right-skewed shape of income data.',
  category: 'economics',
  chartType: 'histogram',
  preview: '\u{1F4B0}',
  data: {
    raw: [
      15000, 18000, 21000, 22000, 24000, 25000, 26000, 27000, 28000, 28500,
      29000, 30000, 31000, 32000, 33000, 34000, 35000, 35500, 36000, 37000,
      38000, 39000, 40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000,
      48000, 49000, 50000, 51000, 52000, 53000, 54000, 55000, 56000, 57000,
      58000, 60000, 62000, 63000, 65000, 67000, 69000, 71000, 73000, 75000,
      78000, 80000, 83000, 86000, 89000, 92000, 95000, 98000, 102000, 107000,
      112000, 118000, 125000, 133000, 142000, 155000, 170000, 190000, 220000,
      260000, 310000, 400000, 520000, 750000,
    ],
  },
  options: {
    title: 'The income distribution',
    subtitle: 'US household income, 2024. Median $75,149',
    source: 'Source: US Census Bureau, Current Population Survey',
    xAxisLabel: 'Annual household income ($)',
    yAxisLabel: 'Frequency',
  },
};

const populationDemographics: ChartTemplate = {
  id: 'population-demographics',
  name: 'Population Demographics',
  description: 'Japan\'s ageing population pyramid. A textbook case of demographic inversion.',
  category: 'economics',
  chartType: 'population-pyramid',
  preview: '\u{1F3DB}',
  data: {
    items: [
      { label: '0-9', value: 0, left: 4.2, right: 4.0 },
      { label: '10-19', value: 0, left: 4.5, right: 4.3 },
      { label: '20-29', value: 0, left: 5.1, right: 4.9 },
      { label: '30-39', value: 0, left: 5.7, right: 5.5 },
      { label: '40-49', value: 0, left: 7.2, right: 7.0 },
      { label: '50-59', value: 0, left: 7.8, right: 7.6 },
      { label: '60-69', value: 0, left: 7.1, right: 7.4 },
      { label: '70-79', value: 0, left: 6.8, right: 7.5 },
      { label: '80+', value: 0, left: 3.8, right: 5.5 },
    ],
  },
  options: {
    title: 'Japan\'s ageing society',
    subtitle: 'Population by age group and gender (%), 2024. Left = male, right = female',
    source: 'Source: Statistics Bureau of Japan',
  },
};

// ═══════════════════════════════════════════════════════════════
//  SURVEY TEMPLATES
// ═══════════════════════════════════════════════════════════════

const netPromoterScore: ChartTemplate = {
  id: 'net-promoter-score',
  name: 'Net Promoter Score',
  description: 'NPS by product line. Detractors left, promoters right. Instantly spot problem areas.',
  category: 'survey',
  chartType: 'diverging-bar',
  preview: '\u{2B50}',
  data: {
    items: [
      { label: 'Mobile app', value: 0, left: 12, right: 58 },
      { label: 'Web platform', value: 0, left: 18, right: 44 },
      { label: 'Customer support', value: 0, left: 22, right: 51 },
      { label: 'Onboarding', value: 0, left: 31, right: 38 },
      { label: 'Documentation', value: 0, left: 25, right: 33 },
      { label: 'Billing', value: 0, left: 35, right: 28 },
      { label: 'API / integrations', value: 0, left: 15, right: 61 },
    ],
  },
  options: {
    title: 'Net Promoter Score by touchpoint',
    subtitle: '% detractors (left) vs % promoters (right), Q4 2024 survey, n=2,847',
    source: 'Source: Customer experience survey',
  },
};

const satisfactionBreakdown: ChartTemplate = {
  id: 'satisfaction-breakdown',
  name: 'Satisfaction Breakdown',
  description: 'Five service dimensions rated on a 5-point scale. Stacked bars show the full distribution.',
  category: 'survey',
  chartType: 'stacked-bar',
  preview: '\u{1F4CA}',
  data: {
    labels: ['Speed', 'Quality', 'Value for money', 'Communication', 'Overall'],
    series: [
      { name: 'Very dissatisfied', data: [4, 3, 8, 5, 4], color: '#D4351C' },
      { name: 'Dissatisfied', data: [8, 6, 14, 9, 7], color: '#F47738' },
      { name: 'Neutral', data: [18, 15, 22, 19, 16], color: '#B1B4B6' },
      { name: 'Satisfied', data: [42, 44, 35, 40, 43], color: '#85994B' },
      { name: 'Very satisfied', data: [28, 32, 21, 27, 30], color: '#00703C' },
    ],
  },
  options: {
    title: 'Customer satisfaction breakdown',
    subtitle: 'Distribution of ratings by service dimension (%), n=1,523',
    source: 'Source: Annual customer satisfaction survey, 2024',
    yAxisFormat: 'percent',
  },
};

const responseWordCloud: ChartTemplate = {
  id: 'response-word-cloud',
  name: 'Response Word Cloud',
  description: 'Most common themes from open-ended survey responses. Size reflects frequency of mention.',
  category: 'survey',
  chartType: 'word-cloud',
  preview: '\u{2601}',
  data: {
    items: [
      { label: 'easy to use', value: 142 },
      { label: 'fast', value: 128 },
      { label: 'reliable', value: 115 },
      { label: 'expensive', value: 98 },
      { label: 'customer service', value: 92 },
      { label: 'intuitive', value: 87 },
      { label: 'integration', value: 82 },
      { label: 'mobile app', value: 78 },
      { label: 'reporting', value: 74 },
      { label: 'slow loading', value: 68 },
      { label: 'customizable', value: 65 },
      { label: 'onboarding', value: 61 },
      { label: 'documentation', value: 58 },
      { label: 'security', value: 55 },
      { label: 'pricing', value: 52 },
      { label: 'dashboards', value: 49 },
      { label: 'API', value: 46 },
      { label: 'collaboration', value: 43 },
      { label: 'automation', value: 40 },
      { label: 'training', value: 37 },
      { label: 'analytics', value: 35 },
      { label: 'notifications', value: 32 },
      { label: 'permissions', value: 29 },
      { label: 'export', value: 26 },
      { label: 'templates', value: 23 },
    ],
  },
  options: {
    title: 'What customers are saying',
    subtitle: 'Most frequent themes in open-ended responses, n=3,241',
    source: 'Source: Q4 2024 product feedback survey',
  },
};

// ═══════════════════════════════════════════════════════════════
//  EDITORIAL TEMPLATES
// ═══════════════════════════════════════════════════════════════

const climateChange: ChartTemplate = {
  id: 'climate-change-emissions',
  name: 'Climate Change Emissions',
  description: 'Global CO2 emissions 1970-2024. The relentless upward trend with a pandemic dip.',
  category: 'editorial',
  chartType: 'area',
  preview: '\u{1F321}',
  data: {
    labels: ['1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'Global CO2 emissions', data: [14.9, 16.0, 18.3, 19.5, 20.5, 21.4, 23.0, 26.3, 30.4, 32.1, 33.5, 34.2, 31.5, 33.4, 34.8, 35.8, 36.8] },
    ],
  },
  options: {
    title: 'The carbon curve keeps climbing',
    subtitle: 'Global CO2 emissions from fossil fuels, billion tonnes, 1970-2024',
    source: 'Source: Global Carbon Project',
    yAxisLabel: 'Gt CO2',
  },
};

const technologyAdoption: ChartTemplate = {
  id: 'technology-adoption',
  name: 'Technology Adoption Curves',
  description: 'Web traffic share by device type. The mobile takeover in one chart.',
  category: 'editorial',
  chartType: 'stacked-area',
  preview: '\u{1F4F2}',
  data: {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    series: [
      { name: 'Desktop', data: [56.7, 51.3, 46.5, 43.2, 40.1, 37.0, 35.8, 34.2, 33.5, 32.8] },
      { name: 'Smartphone', data: [35.1, 40.5, 45.3, 49.0, 52.1, 55.2, 56.5, 58.1, 59.0, 60.1] },
      { name: 'Tablet', data: [8.2, 8.2, 8.2, 7.8, 7.8, 7.8, 7.7, 7.7, 7.5, 7.1] },
    ],
  },
  options: {
    title: 'The mobile takeover',
    subtitle: 'Share of global web traffic by device type (%), 2015-2024',
    source: 'Source: Statcounter GlobalStats',
    yAxisFormat: 'percent',
  },
};

const cityRankings: ChartTemplate = {
  id: 'city-rankings',
  name: 'City Quality of Life Rankings',
  description: 'Top 10 cities ranked by quality of life score. Clean lollipop format for editorial use.',
  category: 'editorial',
  chartType: 'lollipop',
  preview: '\u{1F3D9}',
  data: {
    items: [
      { label: 'Vienna', value: 99.1 },
      { label: 'Zurich', value: 98.4 },
      { label: 'Vancouver', value: 97.3 },
      { label: 'Munich', value: 96.8 },
      { label: 'Auckland', value: 96.0 },
      { label: 'Copenhagen', value: 95.3 },
      { label: 'Geneva', value: 94.7 },
      { label: 'Sydney', value: 94.2 },
      { label: 'Singapore', value: 93.5 },
      { label: 'Tokyo', value: 92.8 },
    ],
  },
  options: {
    title: 'The world\'s most liveable cities',
    subtitle: 'Quality of life index score (0-100), 2024',
    source: 'Source: Mercer Quality of Living Survey',
    xAxisLabel: 'Quality of life score',
  },
};

// ═══════════════════════════════════════════════════════════════
//  EXPORT
// ═══════════════════════════════════════════════════════════════

export const CHART_TEMPLATES: ChartTemplate[] = [
  // Business
  quarterlyRevenueBridge,
  marketShareComparison,
  salesByRegion,
  kpiDashboard,
  growthVsProfitability,
  // Economics
  gdpGrowthComparison,
  tradeBalance,
  inflationVsInterestRates,
  incomeDistribution,
  populationDemographics,
  // Survey
  netPromoterScore,
  satisfactionBreakdown,
  responseWordCloud,
  // Editorial
  climateChange,
  technologyAdoption,
  cityRankings,
];

export const TEMPLATE_CATEGORIES: { id: ChartTemplate['category']; label: string; description: string }[] = [
  { id: 'business', label: 'Business', description: 'Revenue bridges, market share, KPIs, and growth analysis' },
  { id: 'economics', label: 'Economics', description: 'GDP, trade, inflation, income, and demographics' },
  { id: 'survey', label: 'Survey & Research', description: 'NPS, satisfaction scales, and open-ended responses' },
  { id: 'editorial', label: 'Editorial & Data Journalism', description: 'Climate, technology trends, and city rankings' },
];
