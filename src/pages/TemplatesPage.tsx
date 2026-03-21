import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CHART_TEMPLATES, TEMPLATE_CATEGORIES } from '../templates';
import { CHART_CATALOGUE } from '../types/catalogue';
import type { ChartTemplate } from '../templates';

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  const chartTypeName = (template: ChartTemplate): string => {
    const meta = CHART_CATALOGUE.find((c) => c.id === template.chartType);
    return meta?.name ?? template.chartType;
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      {/* Hero header */}
      <div style={{ marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid #E8E0D4' }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#1A1714',
          margin: 0,
          letterSpacing: -0.5,
          lineHeight: 1.15,
        }}>
          Start from a template
        </h1>
        <p style={{
          fontSize: 15,
          color: '#5C574F',
          marginTop: 8,
          lineHeight: 1.5,
        }}>
          Pre-built charts with realistic data. Click one to open it in the editor,
          <br />
          then swap in your own numbers and export.
        </p>
      </div>

      {TEMPLATE_CATEGORIES.map((cat) => {
        const templates = CHART_TEMPLATES.filter((t) => t.category === cat.id);
        if (templates.length === 0) return null;

        return (
          <div key={cat.id} style={{ marginBottom: 40 }}>
            {/* Category header */}
            <div style={{
              marginBottom: 16,
              paddingBottom: 8,
              borderBottom: '1px solid #EDE7DD',
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#9B9488',
                margin: 0,
              }}>
                {cat.label}
              </p>
              <p style={{
                fontSize: 13,
                color: '#7A7468',
                margin: '4px 0 0',
                lineHeight: 1.4,
              }}>
                {cat.description}
              </p>
            </div>

            {/* Template cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => navigate(`/edit/${template.chartType}?template=${template.id}`)}
                  style={{
                    background: '#FDF8F0',
                    border: '1px solid #E8E0D4',
                    borderRadius: 10,
                    padding: '18px 18px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(60, 45, 20, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#E3120B';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(227, 18, 11, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E0D4';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(60, 45, 20, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Preview emoji */}
                  <div style={{ fontSize: 30, marginBottom: 10, lineHeight: 1 }}>
                    {template.preview}
                  </div>

                  {/* Name */}
                  <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#2D2A26',
                    margin: '0 0 4px',
                    lineHeight: 1.3,
                  }}>
                    {template.name}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontSize: 12,
                    color: '#7A7468',
                    lineHeight: 1.5,
                    margin: '0 0 12px',
                    flexGrow: 1,
                  }}>
                    {template.description}
                  </p>

                  {/* Chart type badge */}
                  <span style={{
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: '#EEEBE5',
                    color: '#5C574F',
                    letterSpacing: '0.02em',
                  }}>
                    {chartTypeName(template)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplatesPage;
