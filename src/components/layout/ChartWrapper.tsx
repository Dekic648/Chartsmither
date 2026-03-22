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
  footnote?: string;
  legendItems?: LegendItem[];
  legendPosition?: 'top' | 'bottom' | 'none';
  titleFontSize?: number;
  subtitleFontSize?: number;
  children: React.ReactNode;
  width?: number;
  theme?: BrandTheme;
}

function buildStyles(t: BrandTheme, titleFontSize?: number, subtitleFontSize?: number) {
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
      padding: '16px 16px',
      lineHeight: 1.25,
    } as React.CSSProperties,

    title: {
      color: t.masthead.color,
      fontSize: titleFontSize ? `${titleFontSize}px` : '1.125rem',
      fontWeight: 700,
      fontFamily: t.fonts.title,
      letterSpacing: '-0.01em',
      margin: 0,
      lineHeight: 1.3,
    } as React.CSSProperties,

    subtitleBar: {
      padding: '8px 16px',
      borderBottom: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    subtitle: {
      color: t.colors.textSecondary,
      fontSize: subtitleFontSize ? `${subtitleFontSize}px` : '0.875rem',
      fontFamily: t.fonts.body,
      fontWeight: 400,
      lineHeight: 1.45,
      margin: 0,
    } as React.CSSProperties,

    legend: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '8px 16px',
      borderBottom: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    legendEntry: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
      padding: '16px 16px',
    } as React.CSSProperties,

    sourceBar: {
      padding: '8px 16px',
      borderTop: '1px solid var(--cc-card-border, #e0e0e0)',
    } as React.CSSProperties,

    sourceText: {
      fontSize: '0.6875rem',
      color: t.colors.textTertiary,
      fontFamily: t.fonts.body,
      margin: 0,
      lineHeight: 1.4,
    } as React.CSSProperties,

    footnoteText: {
      fontSize: '0.625rem',
      color: t.colors.textTertiary,
      fontFamily: t.fonts.body,
      fontStyle: 'italic' as const,
      margin: '4px 0 0',
      lineHeight: 1.4,
    } as React.CSSProperties,
  };
}

const LegendBar: React.FC<{ items: LegendItem[]; styles: ReturnType<typeof buildStyles> }> = ({ items, styles }) => (
  <div style={styles.legend}>
    {items.map((item) => (
      <div key={item.label} style={styles.legendEntry}>
        <span style={styles.legendSwatch(item.color, item.dashed)} />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  source,
  footnote,
  legendItems,
  legendPosition = 'top',
  titleFontSize,
  subtitleFontSize,
  children,
  width,
  theme = economistTheme,
}) => {
  const styles = buildStyles(theme, titleFontSize, subtitleFontSize);
  const showLegend = legendPosition !== 'none' && legendItems && legendItems.length > 0;

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

      {/* Legend — top */}
      {showLegend && legendPosition === 'top' && (
        <LegendBar items={legendItems} styles={styles} />
      )}

      {/* Chart content */}
      <div style={styles.content}>{children}</div>

      {/* Legend — bottom */}
      {showLegend && legendPosition === 'bottom' && (
        <LegendBar items={legendItems} styles={styles} />
      )}

      {/* Source + footnote */}
      {(source || footnote) && (
        <div style={styles.sourceBar}>
          {source && <p style={styles.sourceText}>Source: {source}</p>}
          {footnote && <p style={styles.footnoteText}>{footnote}</p>}
        </div>
      )}
    </div>
  );
};

export default ChartWrapper;
