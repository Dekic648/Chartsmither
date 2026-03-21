import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CHART_CATALOGUE, CHART_CATEGORIES } from '../types/catalogue';
import type { ChartTypeId } from '../types/chart';
import ChartThumbnail from '../components/ui/ChartThumbnail';

const CataloguePage: React.FC = () => {
  const navigate = useNavigate();

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
          Your data, beautifully told
        </h1>
        <p style={{
          fontSize: 15,
          color: '#5C574F',
          marginTop: 8,
          lineHeight: 1.5,
        }}>
          {CHART_CATALOGUE.length} publication-quality charts styled after The Economist.
          <br />
          Pick one, drop in your data, and export in seconds.
        </p>
      </div>

      {CHART_CATEGORIES.map((cat) => {
        const charts = CHART_CATALOGUE.filter((c) => c.category === cat.id);
        if (charts.length === 0) return null;

        return (
          <div key={cat.id} style={{ marginBottom: 36 }}>
            <p style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9B9488',
              margin: '0 0 14px',
              paddingBottom: 8,
              borderBottom: '1px solid #EDE7DD',
            }}>
              {cat.label}
            </p>

            <div className="cc-catalogue-grid">
              {charts.map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => navigate(`/edit/${chart.id}`)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E0D4',
                    borderRadius: 8,
                    padding: '16px 16px 14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(60, 45, 20, 0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#E3120B';
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(227, 18, 11, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E0D4';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(60, 45, 20, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <ChartThumbnail typeId={chart.id as ChartTypeId} />
                  </div>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1A1714',
                    margin: '0 0 4px',
                    lineHeight: 1.3,
                  }}>
                    {chart.name}
                  </p>
                  <p style={{
                    fontSize: 11.5,
                    color: '#7A7468',
                    lineHeight: 1.45,
                    margin: 0,
                  }}>
                    {chart.description}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '2px 7px',
                    borderRadius: 4,
                    marginTop: 10,
                    background: chart.engine === 'chartjs' ? '#EEF4FA' : '#EEF7F1',
                    color: chart.engine === 'chartjs' ? '#2E6DA4' : '#1A7A4A',
                    letterSpacing: '0.02em',
                  }}>
                    {chart.engine === 'chartjs' ? 'interactive' : 'SVG'}
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

export default CataloguePage;
