import React from 'react';
import type { Report } from '../../types/chart';
import type { BrandTheme } from '../../theme/brands';
import { getBrandTheme } from '../../theme/brands';

interface CoverPageProps {
  report: Report;
  width?: number;
  height?: number;
}

const CoverPage: React.FC<CoverPageProps> = ({ report, width = 620, height = 480 }) => {
  const theme: BrandTheme = getBrandTheme(report.brandTheme ?? 'economist');

  const confidentialityLabels: Record<string, string> = {
    confidential: 'CONFIDENTIAL',
    internal: 'INTERNAL USE ONLY',
    public: 'PUBLIC',
  };

  return (
    <div
      style={{
        width,
        height,
        background: theme.colors.background,
        border: '1px solid var(--cc-card-border, #e0e0e0)',
        borderRadius: theme.style.borderRadius,
        overflow: 'hidden',
        fontFamily: theme.fonts.body,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--cc-shadow, rgba(0,0,0,0.06) 0 2px 8px)',
      }}
    >
      {/* Masthead bar */}
      <div
        style={{
          background: theme.masthead.background,
          padding: '40px 40px 32px',
          flex: '0 0 auto',
        }}
      >
        {report.firmName && (
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: `${theme.masthead.color}BB`,
              margin: '0 0 12px',
              fontFamily: theme.fonts.body,
            }}
          >
            {report.firmName}
          </p>
        )}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: theme.masthead.color,
            margin: 0,
            lineHeight: 1.2,
            fontFamily: theme.fonts.title,
            letterSpacing: '-0.02em',
          }}
        >
          {report.title || 'Untitled Report'}
        </h1>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {report.clientName && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.colors.textTertiary, margin: '0 0 4px' }}>
                Prepared for
              </p>
              <p style={{ fontSize: 18, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, fontFamily: theme.fonts.title }}>
                {report.clientName}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 40 }}>
            {report.date && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.colors.textTertiary, margin: '0 0 4px' }}>
                  Date
                </p>
                <p style={{ fontSize: 14, color: theme.colors.textPrimary, margin: 0 }}>
                  {report.date}
                </p>
              </div>
            )}
            {report.preparedBy && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.colors.textTertiary, margin: '0 0 4px' }}>
                  Prepared by
                </p>
                <p style={{ fontSize: 14, color: theme.colors.textPrimary, margin: 0 }}>
                  {report.preparedBy}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Confidentiality footer */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.gridLine}`,
            paddingTop: 12,
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: theme.colors.textTertiary,
              margin: 0,
            }}
          >
            {confidentialityLabels[report.confidentiality] ?? 'CONFIDENTIAL'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
