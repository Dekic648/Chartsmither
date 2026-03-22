import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, X, Plus, FileText, Presentation, Trash2 } from 'lucide-react';
import type { Report, ReportPage, SavedChart, ChartTypeId, ChartData, ChartOptions } from '../types/chart';
import { DEFAULT_OPTIONS } from '../types/chart';
import {
  listReports, createReport, saveReport, loadReport, deleteReport,
  listGalleryCharts, loadGalleryChart, migrateToGallery,
} from '../utils/storage';
import { getBrandTheme } from '../theme/brands';
import { CHARTJS_RENDERERS } from '../charts/chartjs';
import { SVG_RENDERERS } from '../charts/svg';
import { TIER2_BATCH1_RENDERERS } from '../charts/svg/tier2-batch1';
import { TIER2_BATCH2_RENDERERS } from '../charts/svg/tier2-batch2';
import { TIER2_BATCH3_RENDERERS } from '../charts/svg/tier2-batch3';
import { TIER3_RENDERERS } from '../charts/svg/tier3';
import { MAP_RENDERERS } from '../charts/maps';
import { CHART_CATALOGUE } from '../types/catalogue';
import ChartWrapper from '../components/layout/ChartWrapper';
import CoverPage from '../components/report/CoverPage';
import { exportReportPdf, exportReportPptx } from '../utils/reportExport';

const ALL_RENDERERS: Record<string, React.FC<{ data: ChartData; options: ChartOptions; width?: number; height?: number }>> = {
  ...CHARTJS_RENDERERS,
  ...SVG_RENDERERS,
  ...TIER2_BATCH1_RENDERERS,
  ...TIER2_BATCH2_RENDERERS,
  ...TIER2_BATCH3_RENDERERS,
  ...TIER3_RENDERERS,
  ...MAP_RENDERERS,
};

// ── Styles ──────────────────────────────────────────

const s = {
  page: { maxWidth: 1100, margin: '0 auto' },
  header: {
    fontSize: 28, fontWeight: 700, color: '#1A1714', margin: '0 0 8px',
    letterSpacing: -0.5, lineHeight: 1.15,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#5C574F', margin: '0 0 24px', lineHeight: 1.5 } as React.CSSProperties,
  btn: {
    padding: '8px 16px', fontSize: 12, fontWeight: 600,
    border: '1px solid #E8E0D4', borderRadius: 5, background: '#fff',
    color: '#2D2A26', cursor: 'pointer', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    display: 'inline-flex', alignItems: 'center', gap: 6,
  } as React.CSSProperties,
  btnPrimary: {
    padding: '8px 16px', fontSize: 12, fontWeight: 600,
    border: '1px solid #E3120B', borderRadius: 5, background: '#E3120B',
    color: '#fff', cursor: 'pointer', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    display: 'inline-flex', alignItems: 'center', gap: 6,
  } as React.CSSProperties,
  input: {
    padding: '7px 10px', fontSize: 13, border: '1px solid #E8E0D4', borderRadius: 5,
    background: '#FEFCF9', color: '#2D2A26', outline: 'none', width: '100%',
    boxSizing: 'border-box' as const, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  select: {
    padding: '7px 10px', fontSize: 13, border: '1px solid #E8E0D4', borderRadius: 5,
    background: '#FEFCF9', color: '#2D2A26', outline: 'none', cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  label: {
    fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const,
    letterSpacing: '0.06em', color: '#9B9488', margin: '0 0 3px',
  } as React.CSSProperties,
  card: {
    background: '#fff', border: '1px solid #E8E0D4', borderRadius: 8,
    padding: 16, cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: '0 1px 3px rgba(60,45,20,0.03)',
  },
};

// ── Report List View ────────────────────────────────

function ReportList({ onOpen, onCreate }: { onOpen: (id: string) => void; onCreate: () => void }) {
  const [reports, setReports] = useState(listReports());

  const handleDelete = (id: string) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;
    deleteReport(id);
    setReports(listReports());
  };

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={s.header}>Reports</h1>
          <p style={s.subtitle}>Package your charts into branded client deliverables.</p>
        </div>
        <button style={s.btnPrimary} onClick={onCreate}><Plus size={14} /> New report</button>
      </div>

      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9B9488' }}>
          <FileText size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15, margin: '0 0 8px' }}>No reports yet</p>
          <p style={{ fontSize: 13 }}>Create your first report to start packaging charts for clients.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map((r) => (
            <div
              key={r.id}
              style={s.card}
              onClick={() => onOpen(r.id)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E3120B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E0D4'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1A1714', margin: '0 0 4px' }}>
                    {r.title || 'Untitled Report'}
                  </p>
                  <p style={{ fontSize: 12, color: '#7A7468', margin: 0 }}>
                    {r.clientName || 'No client'} &middot; {r.pageCount} chart{r.pageCount !== 1 ? 's' : ''} &middot; {new Date(r.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  style={{ ...s.btn, padding: '4px 8px', fontSize: 11 }}
                  onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Chart Page Renderer (for preview & export) ──────

function ChartPagePreview({ chartId, chartTypeId, width = 580 }: { chartId: string; chartTypeId: ChartTypeId; width?: number }) {
  const saved = loadGalleryChart(chartId);
  if (!saved) {
    return (
      <div style={{ width, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF4EA', borderRadius: 8, color: '#9B9488', fontSize: 13 }}>
        Chart unavailable (may have been deleted)
      </div>
    );
  }

  const meta = CHART_CATALOGUE.find((c) => c.id === chartTypeId);
  const Renderer = ALL_RENDERERS[chartTypeId];
  const opts = { ...DEFAULT_OPTIONS, ...saved.options };
  const chartH = Math.min(opts.height - 100, 280);

  return (
    <ChartWrapper
      title={opts.title}
      subtitle={opts.subtitle}
      source={opts.source}
      footnote={opts.footnote}
      legendPosition={opts.legendPosition}
      titleFontSize={opts.titleFontSize}
      subtitleFontSize={opts.subtitleFontSize}
      width={width}
      theme={getBrandTheme(opts.brandTheme ?? 'economist')}
    >
      <div style={{ position: 'relative', height: chartH }}>
        {Renderer ? (
          <Renderer data={saved.data} options={opts} width={width - 32} height={chartH} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9B9488', fontSize: 13 }}>
            Renderer not available for {meta?.name ?? chartTypeId}
          </div>
        )}
      </div>
    </ChartWrapper>
  );
}

// ── Report Builder ──────────────────────────────────

function ReportBuilder({ reportId, onBack }: { reportId: string; onBack: () => void }) {
  const [report, setReport] = useState<Report | null>(null);
  const [gallery, setGallery] = useState<SavedChart[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(-1); // -1 = cover page
  const [exporting, setExporting] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    migrateToGallery();
    const r = loadReport(reportId);
    if (r) setReport(r);
    setGallery(listGalleryCharts());
  }, [reportId]);

  const updateReport = useCallback((patch: Partial<Report>) => {
    setReport((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      saveReport(updated);
      return updated;
    });
  }, []);

  if (!report) return <p style={{ padding: 40, textAlign: 'center', color: '#9B9488' }}>Loading report...</p>;

  const addChart = (chart: SavedChart) => {
    const page: ReportPage = { chartId: chart.id, chartTypeId: chart.typeId };
    updateReport({ pages: [...report.pages, page] });
  };

  const removePage = (index: number) => {
    const pages = report.pages.filter((_, i) => i !== index);
    updateReport({ pages });
    if (selectedPage >= pages.length) setSelectedPage(pages.length - 1);
  };

  const movePage = (index: number, dir: -1 | 1) => {
    const pages = [...report.pages];
    const target = index + dir;
    if (target < 0 || target >= pages.length) return;
    [pages[index], pages[target]] = [pages[target], pages[index]];
    updateReport({ pages });
    setSelectedPage(target);
  };

  const warnIfEmpty = (): boolean => {
    if (!report.title && !report.clientName) {
      return confirm('Report title and client name are empty. Export anyway?');
    }
    return true;
  };

  const handleExportPdf = async () => {
    if (!previewRef.current || !warnIfEmpty()) return;
    setExporting('Generating PDF...');
    try {
      await exportReportPdf(report, previewRef.current);
      setExporting(null);
    } catch (err) {
      console.error(err);
      setExporting('PDF export failed');
      setTimeout(() => setExporting(null), 3000);
    }
  };

  const handleExportPptx = async () => {
    if (!previewRef.current || !warnIfEmpty()) return;
    setExporting('Generating PPTX...');
    try {
      await exportReportPptx(report, previewRef.current);
      setExporting(null);
    } catch (err) {
      console.error(err);
      setExporting('PPTX export failed');
      setTimeout(() => setExporting(null), 3000);
    }
  };

  return (
    <div style={s.page}>
      {/* Back + Export bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #EDE7DD' }}>
        <button style={s.btn} onClick={onBack}>Back to reports</button>
        <div style={{ flex: 1 }} />
        <button style={s.btnPrimary} onClick={handleExportPdf} disabled={report.pages.length === 0}>
          <FileText size={14} /> Export PDF
        </button>
        <button style={s.btnPrimary} onClick={handleExportPptx} disabled={report.pages.length === 0}>
          <Presentation size={14} /> Export PPTX
        </button>
        {exporting && <span style={{ fontSize: 12, color: exporting.includes('failed') ? '#B91C1C' : '#7A7468' }}>{exporting}</span>}
      </div>

      {/* Metadata bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8,
        background: '#fff', border: '1px solid #E8E0D4', borderRadius: 8, padding: 14, marginBottom: 16,
      }}>
        <div><p style={s.label}>Client name</p><input style={s.input} value={report.clientName} onChange={(e) => updateReport({ clientName: e.target.value })} placeholder="Acme Corp" /></div>
        <div><p style={s.label}>Firm name</p><input style={s.input} value={report.firmName} onChange={(e) => updateReport({ firmName: e.target.value })} placeholder="Your firm" /></div>
        <div><p style={s.label}>Report title</p><input style={s.input} value={report.title} onChange={(e) => updateReport({ title: e.target.value })} placeholder="Q4 Analysis" /></div>
        <div><p style={s.label}>Date</p><input style={s.input} type="date" value={report.date} onChange={(e) => updateReport({ date: e.target.value })} /></div>
        <div><p style={s.label}>Prepared by</p><input style={s.input} value={report.preparedBy} onChange={(e) => updateReport({ preparedBy: e.target.value })} placeholder="Name" /></div>
        <div>
          <p style={s.label}>Confidentiality</p>
          <select style={s.select} value={report.confidentiality} onChange={(e) => updateReport({ confidentiality: e.target.value as Report['confidentiality'] })}>
            <option value="confidential">Confidential</option>
            <option value="internal">Internal</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      {/* Main grid: page list | preview | chart picker */}
      <div className="cc-report-grid">

        {/* Page list (left) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ ...s.label, marginBottom: 4 }}>Pages</p>

          {/* Cover page */}
          <div
            onClick={() => setSelectedPage(-1)}
            style={{
              ...s.card, padding: 8, cursor: 'pointer',
              borderColor: selectedPage === -1 ? '#E3120B' : '#E8E0D4',
              fontSize: 11, fontWeight: 600, color: '#1A1714',
            }}
          >
            Cover Page
          </div>

          {/* Chart pages */}
          {report.pages.map((page, i) => {
            const saved = loadGalleryChart(page.chartId);
            return (
              <div
                key={`${page.chartId}-${i}`}
                onClick={() => setSelectedPage(i)}
                style={{
                  ...s.card, padding: 8, cursor: 'pointer',
                  borderColor: selectedPage === i ? '#E3120B' : '#E8E0D4',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1714', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {saved?.title || page.chartTypeId}
                </p>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#9B9488' }} onClick={(e) => { e.stopPropagation(); movePage(i, -1); }} disabled={i === 0}><ChevronUp size={12} /></button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#9B9488' }} onClick={(e) => { e.stopPropagation(); movePage(i, 1); }} disabled={i === report.pages.length - 1}><ChevronDown size={12} /></button>
                  <div style={{ flex: 1 }} />
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: '#B91C1C' }} onClick={(e) => { e.stopPropagation(); removePage(i); }}><X size={12} /></button>
                </div>
              </div>
            );
          })}

          {report.pages.length === 0 && (
            <p style={{ fontSize: 11, color: '#9B9488', padding: '8px 0' }}>Add charts from the right panel</p>
          )}
        </div>

        {/* Preview (center) */}
        <div style={{ minHeight: 400 }}>
          {selectedPage === -1 ? (
            <CoverPage report={report} width={580} height={440} />
          ) : report.pages[selectedPage] ? (
            <div>
              <ChartPagePreview
                chartId={report.pages[selectedPage].chartId}
                chartTypeId={report.pages[selectedPage].chartTypeId}
                width={580}
              />
              <p style={{ fontSize: 10, color: '#9B9488', textAlign: 'center', marginTop: 8 }}>
                Page {selectedPage + 2} of {report.pages.length + 1}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#9B9488' }}>
              Select a page to preview
            </div>
          )}
        </div>

        {/* Hidden export container — renders all pages for PDF/PPTX capture */}
        <div ref={previewRef} style={{ position: 'absolute', left: -9999, top: 0, width: 620 }}>
          <div data-report-cover>
            <CoverPage report={report} width={620} height={480} />
          </div>
          {report.pages.map((page, i) => (
            <div key={`export-${page.chartId}-${i}`} data-report-chart>
              <ChartPagePreview chartId={page.chartId} chartTypeId={page.chartTypeId} width={620} />
            </div>
          ))}
        </div>

        {/* Chart picker (right) */}
        <div>
          <p style={{ ...s.label, marginBottom: 8 }}>Saved Charts</p>
          {gallery.length === 0 ? (
            <div style={{ fontSize: 12, color: '#9B9488', padding: '16px 0', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 8px' }}>No saved charts yet.</p>
              <p style={{ margin: 0 }}>Go to <a href="/" style={{ color: '#E3120B' }}>Charts</a>, create a chart, and it will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 500, overflowY: 'auto' }}>
              {gallery.map((chart) => (
                <div
                  key={chart.id}
                  style={{ ...s.card, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1714', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chart.title}
                    </p>
                    <p style={{ fontSize: 10, color: '#9B9488', margin: '2px 0 0' }}>{chart.typeId}</p>
                  </div>
                  <button
                    style={{ border: 'none', background: '#E3120B', color: '#fff', borderRadius: 4, width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 6 }}
                    onClick={() => addChart(chart)}
                    title="Add to report"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────

const ReportsPage: React.FC = () => {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  const handleCreate = () => {
    const report = createReport();
    setActiveReportId(report.id);
  };

  const handleOpen = (id: string) => {
    setActiveReportId(id);
  };

  if (activeReportId) {
    return <ReportBuilder reportId={activeReportId} onBack={() => setActiveReportId(null)} />;
  }

  return <ReportList onOpen={handleOpen} onCreate={handleCreate} />;
};

export default ReportsPage;
