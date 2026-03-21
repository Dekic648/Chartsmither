// The Economist visual style — colors, fonts, spacing

export const ECONOMIST_COLORS = {
  // Masthead red
  red: '#E3120B',

  // Primary data palette (ordered for best contrast)
  palette: [
    '#2E6DA4', // Steel blue
    '#C0392B', // Crimson
    '#1A7A4A', // Forest green
    '#E07B22', // Amber
    '#8E44AD', // Purple
    '#16A085', // Teal
    '#D4AC0D', // Gold
    '#2C3E50', // Dark slate
    '#E74C3C', // Bright red
    '#3498DB', // Sky blue
    '#27AE60', // Emerald
    '#F39C12', // Orange
  ],

  // Semantic
  positive: '#1A7A4A',
  negative: '#C0392B',
  neutral: '#888888',
  target: '#AAAAAA',

  // Chrome
  axis: '#888888',
  gridLine: '#E8E8E8',
  gridLineFaint: '#F2F2F2',
  border: '#DDDDDD',
  background: '#FFFFFF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#999999',
};

export const ECONOMIST_FONTS = {
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

export const ECONOMIST_SPACING = {
  chartPadding: { top: 12, right: 16, bottom: 8, left: 8 },
  headerHeight: 40,
  maxWidth: 620,
};

// Chart.js defaults matching Economist style
export const CHARTJS_ECONOMIST_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#555',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 10,
      titleFont: { size: 12, weight: 'bold' as const, family: ECONOMIST_FONTS.sans },
      bodyFont: { size: 12, family: ECONOMIST_FONTS.sans },
      cornerRadius: 3,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: ECONOMIST_COLORS.axis,
        font: { size: 11, family: ECONOMIST_FONTS.sans },
        maxRotation: 0,
      },
    },
    y: {
      grid: {
        color: ECONOMIST_COLORS.gridLine,
        lineWidth: 0.8,
      },
      border: { display: false },
      ticks: {
        color: ECONOMIST_COLORS.axis,
        font: { size: 11, family: ECONOMIST_FONTS.sans },
      },
    },
  },
};

export function getColor(index: number): string {
  return ECONOMIST_COLORS.palette[index % ECONOMIST_COLORS.palette.length];
}

export function getColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getColor(i));
}
