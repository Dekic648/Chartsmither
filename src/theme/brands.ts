export interface BrandTheme {
  id: string;
  name: string;
  description: string;
  masthead: { background: string; color: string };
  colors: {
    palette: string[];
    positive: string;
    negative: string;
    neutral: string;
    target: string;
    axis: string;
    gridLine: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
  };
  fonts: { title: string; body: string };
  style: {
    borderRadius: number;
    gridLineWidth: number;
    pointRadius: number;
    lineWidth: number;
    barBorderRadius: number;
  };
}

// ---------------------------------------------------------------------------
// 1. Economist
// ---------------------------------------------------------------------------
export const economistTheme: BrandTheme = {
  id: 'economist',
  name: 'The Economist',
  description: 'Classic red masthead with a steel-blue data palette and Helvetica Neue.',
  masthead: { background: '#E3120B', color: '#FFFFFF' },
  colors: {
    palette: [
      '#2E6DA4', '#C0392B', '#1A7A4A', '#E07B22',
      '#8E44AD', '#16A085', '#D4AC0D', '#2C3E50',
      '#E74C3C', '#3498DB', '#27AE60', '#F39C12',
    ],
    positive: '#1A7A4A',
    negative: '#C0392B',
    neutral: '#888888',
    target: '#AAAAAA',
    axis: '#888888',
    gridLine: '#E8E8E8',
    background: '#FFFFFF',
    textPrimary: '#1A1A1A',
    textSecondary: '#555555',
    textTertiary: '#999999',
  },
  fonts: {
    title: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  style: {
    borderRadius: 4,
    gridLineWidth: 0.8,
    pointRadius: 3,
    lineWidth: 2,
    barBorderRadius: 2,
  },
};

// ---------------------------------------------------------------------------
// 2. Financial Times
// ---------------------------------------------------------------------------
export const ftTheme: BrandTheme = {
  id: 'ft',
  name: 'Financial Times',
  description: 'FT pink background, dark masthead, Georgia serif, muted editorial palette.',
  masthead: { background: '#1A1110', color: '#FFFFFF' },
  colors: {
    palette: [
      '#0F5499', '#990F3D', '#00994D', '#FF8833',
      '#593380', '#0D7680', '#CC0000', '#0A6859',
    ],
    positive: '#00994D',
    negative: '#990F3D',
    neutral: '#808080',
    target: '#B3B3B3',
    axis: '#66605C',
    gridLine: '#E6D9CE',
    background: '#FFF1E5',
    textPrimary: '#33302E',
    textSecondary: '#66605C',
    textTertiary: '#9E9590',
  },
  fonts: {
    title: "Georgia, 'Times New Roman', serif",
    body: "Georgia, 'Times New Roman', serif",
  },
  style: {
    borderRadius: 0,
    gridLineWidth: 1,
    pointRadius: 3,
    lineWidth: 2,
    barBorderRadius: 0,
  },
};

// ---------------------------------------------------------------------------
// 3. Bloomberg
// ---------------------------------------------------------------------------
export const bloombergTheme: BrandTheme = {
  id: 'bloomberg',
  name: 'Bloomberg',
  description: 'Bold black masthead, vivid data colors, sharp edges, Arial Black.',
  masthead: { background: '#000000', color: '#FFFFFF' },
  colors: {
    palette: [
      '#2800D7', '#FF3300', '#00B0F0', '#FFC000',
      '#00B050', '#FF6600', '#7030A0', '#00B0B0',
    ],
    positive: '#00B050',
    negative: '#FF3300',
    neutral: '#666666',
    target: '#999999',
    axis: '#444444',
    gridLine: '#D9D9D9',
    background: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#333333',
    textTertiary: '#777777',
  },
  fonts: {
    title: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
    body: "Arial, 'Helvetica Neue', sans-serif",
  },
  style: {
    borderRadius: 0,
    gridLineWidth: 1,
    pointRadius: 4,
    lineWidth: 2.5,
    barBorderRadius: 0,
  },
};

// ---------------------------------------------------------------------------
// 4. McKinsey
// ---------------------------------------------------------------------------
export const mckinseyTheme: BrandTheme = {
  id: 'mckinsey',
  name: 'McKinsey',
  description: 'Corporate dark-blue masthead, clean McKinsey blue palette, minimal and precise.',
  masthead: { background: '#003B5C', color: '#FFFFFF' },
  colors: {
    palette: [
      '#003B5C', '#0070AD', '#62B5E5', '#9CDCF9',
      '#00A3A1', '#6D6E71',
    ],
    positive: '#0070AD',
    negative: '#C0392B',
    neutral: '#6D6E71',
    target: '#AAAAAA',
    axis: '#6D6E71',
    gridLine: '#E5E5E5',
    background: '#FFFFFF',
    textPrimary: '#222222',
    textSecondary: '#555555',
    textTertiary: '#999999',
  },
  fonts: {
    title: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  style: {
    borderRadius: 2,
    gridLineWidth: 0.6,
    pointRadius: 3,
    lineWidth: 2,
    barBorderRadius: 1,
  },
};

// ---------------------------------------------------------------------------
// 5. Minimal
// ---------------------------------------------------------------------------
export const minimalTheme: BrandTheme = {
  id: 'minimal',
  name: 'Minimal',
  description: 'No-brand grey masthead, black and grey only palette, maximum whitespace, thin lines.',
  masthead: { background: '#F0F0F0', color: '#333333' },
  colors: {
    palette: [
      '#222222', '#555555', '#888888', '#AAAAAA',
      '#CCCCCC', '#444444',
    ],
    positive: '#333333',
    negative: '#888888',
    neutral: '#BBBBBB',
    target: '#CCCCCC',
    axis: '#999999',
    gridLine: '#EEEEEE',
    background: '#FFFFFF',
    textPrimary: '#222222',
    textSecondary: '#666666',
    textTertiary: '#AAAAAA',
  },
  fonts: {
    title: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  style: {
    borderRadius: 0,
    gridLineWidth: 0.5,
    pointRadius: 2,
    lineWidth: 1.5,
    barBorderRadius: 0,
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const BRAND_THEMES: BrandTheme[] = [
  economistTheme,
  ftTheme,
  bloombergTheme,
  mckinseyTheme,
  minimalTheme,
];

export function getBrandTheme(id: string): BrandTheme {
  return BRAND_THEMES.find((t) => t.id === id) ?? economistTheme;
}
