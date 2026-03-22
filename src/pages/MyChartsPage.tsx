import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChartTypeId } from '../types/chart';
import ChartThumbnail from '../components/ui/ChartThumbnail';
import { listGalleryCharts, migrateToGallery } from '../utils/storage';

const MyChartsPage: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => { migrateToGallery(); }, []);
  const savedCharts = listGalleryCharts();

  return (
    <div style={{ maxWidth: 920, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, paddingBottom: 20, borderBottom: '1px solid #E8E0D4' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1A1714', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          My Charts
        </h1>
        <p style={{ fontSize: 15, color: '#7A7468', margin: 0 }}>
          All your saved charts in one place.
        </p>
      </div>

      {savedCharts.length === 0 ? (
        <p style={{ fontSize: 14, color: '#9B9488', textAlign: 'center', marginTop: 48 }}>
          No saved charts yet. Create one from the <a href="/" style={{ color: '#E3120B' }}>Charts</a> page.
        </p>
      ) : (
        <div className="cc-catalogue-grid">
          {savedCharts.map((saved) => (
            <button
              key={saved.id}
              onClick={() => navigate(`/edit/${saved.typeId}`)}
              style={{
                background: '#FDF8F0', border: '1px solid #E8E0D4', borderRadius: 8,
                padding: 16, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(60, 45, 20, 0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E3120B';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E8E0D4';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <ChartThumbnail typeId={saved.typeId as ChartTypeId} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 3px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {saved.title}
              </p>
              <p style={{ fontSize: 11, color: '#9B9488', margin: 0 }}>
                {saved.typeId} &middot; {new Date(saved.savedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChartsPage;
