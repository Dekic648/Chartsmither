import React from 'react';
import type { BrandTheme } from '../../theme/brands';
import { economistTheme } from '../../theme/brands';

interface LegendItem {
  label: string;
  color: string;
  dashed?: boolean;
}

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  source?: string;
  legendItems?: LegendItem[];
  children: React.ReactNode;
  width?: number;
  theme?: BrandTheme;
}

function buildStyles(t: BrandTheme) {
  return {
    wrapper: (width?: number): React.CSSProperties => ({
      width: width ?? '100%',
      maxWidth: '100%',
      background: t.colors.background,
      border: '1px solid var(--cc-card-border, #e0e0e0)',
      borderRadius: t.style.borderRadius,
      boxShadow: 'var(--cc-shadow, rgba(0,0,0,0.06) 0 2px 8px)',
      overflow: 'hidden',
      fontFamily: t.fonts.body,
    }),

    masthead: {
      background: t.masthead.background,
      padding: '14px 20px 12px',
      lineHeight: 1.25,
    } as React.CSSProperties,

    title: {
      color: t.masthead.color,
      fontSize: '1.125rem',
      fontWeight: 700,
      fontFamily: t.fonts.title,
      letterSpacing: '-0.01em',
      margin: 0,
      lineHeight: 1.3,
    } as React.CSSProperties,

    subtitleBar: {
      padding: '10px 20px 6px',
      borderBottom: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    subtitle: {
      color: t.colors.textSecondary,
      fontSize: '0.875rem',
      fontFamily: t.fonts.body,
      fontWeight: 400,
      lineHeight: 1.45,
      margin: 0,
    } as React.CSSProperties,

    legend: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '14px',
      padding: '10px 20px',
      borderBottom: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    legendEntry: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.75rem',
      color: t.colors.textSecondary,
      fontFamily: t.fonts.body,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    } as React.CSSProperties,

    legendSwatch: (color: string, dashed?: boolean): React.CSSProperties => ({
      width: 18,
      height: dashed ? 0 : 10,
      borderRadius: dashed ? 0 : t.style.barBorderRadius,
      backgroundColor: dashed ? 'transparent' : color,
      borderBottom: dashed ? `2px dashed ${color}` : 'none',
      flexShrink: 0,
    }),

    content: {
      padding: '16px 20px 20px',
    } as React.CSSProperties,

    sourceBar: {
      padding: '10px 20px',
      borderTop: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    sourceText: {
      fontSize: '0.6875rem',
      color: t.colors.textTertiary,
      fontFamily: t.fonts.body,
      margin: 0,
      lineHeight: 1.4,
    } as React.CSSProperties,
  };
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  source,
  legendItems,
  children,
  width,
  theme = economistTheme,
}) => {
  const styles = buildStyles(theme);
  return (
    <div style={styles.wrapper(width)}>
      {/* Masthead */}
      <div style={styles.masthead}>
        <h3 style={styles.title}>{title}</h3>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={styles.subtitleBar}>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
      )}

      {/* Legend */}
      {legendItems && legendItems.length > 0 && (
        <div style={styles.legend}>
          {legendItems.map((item) => (
            <div key={item.label} style={styles.legendEntry}>
              <span style={styles.legendSwatch(item.color, item.dashed)} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart content */}
      <div style={styles.content}>{children}</div>

      {/* Source line */}
      {source && (
        <div style={styles.sourceBar}>
          <p style={styles.sourceText}>Source: {source}</p>
        </div>
      )}
    </div>
  );
};

export default ChartWrapper;
