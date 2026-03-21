import React from 'react';
import { BRAND_THEMES } from '../../theme/brands';

interface ThemePickerProps {
  value: string;
  onChange: (themeId: string) => void;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ value, onChange }) => {
  return (
    <div style={styles.container}>
      {BRAND_THEMES.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            style={{
              ...styles.card,
              borderColor: selected ? '#E3120B' : '#E8E0D4',
              borderWidth: selected ? 2 : 1,
            }}
          >
            {/* Masthead preview bar */}
            <div
              style={{
                height: 8,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.masthead.background,
              }}
            />

            {/* Body */}
            <div style={styles.cardBody}>
              <span style={styles.themeName}>{theme.name}</span>

              {/* Color swatch row */}
              <div style={styles.swatchRow}>
                {theme.colors.palette.slice(0, 6).map((color, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.swatch,
                      backgroundColor: color,
                    }}
                  />
                ))}
              </div>

              <span style={styles.description}>{theme.description}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 12,
    padding: 4,
  },
  card: {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    background: '#FDF8F0',
    border: '1px solid #E8E0D4',
    borderRadius: 6,
    overflow: 'hidden',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: 'rgba(0,0,0,0.04) 0 1px 4px',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    padding: '10px 12px 12px',
  },
  themeName: {
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: '#1A1A1A',
    lineHeight: 1.2,
  },
  swatchRow: {
    display: 'flex',
    gap: 4,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 3,
    border: '1px solid rgba(0,0,0,0.08)',
  },
  description: {
    fontSize: '0.6875rem',
    color: '#777777',
    lineHeight: 1.35,
  },
};

export default ThemePicker;
