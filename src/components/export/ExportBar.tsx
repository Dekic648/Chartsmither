import React, { useState } from 'react';
import { Download, Copy, Code, Image, FileText, Presentation } from 'lucide-react';
import { exportPng, exportSvg, exportHtml, exportPdf, exportPptx, copyEmbedCode } from '../../utils/export';

interface ExportBarProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  title?: string;
}

const DPI_OPTIONS = [
  { label: '1x (72 DPI)', ratio: 1 },
  { label: '2x (150 DPI)', ratio: 2 },
  { label: '3x (216 DPI)', ratio: 3 },
  { label: '4x (300 DPI)', ratio: 4 },
];

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  fontSize: 12,
  fontWeight: 600,
  border: '1px solid #E8E0D4',
  borderRadius: 5,
  background: '#FFFFFF',
  color: '#2D2A26',
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  letterSpacing: '0.01em',
};

const btnPrimaryStyle: React.CSSProperties = {
  ...btnStyle,
  background: '#E3120B',
  borderColor: '#E3120B',
  color: '#FFFFFF',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 8px',
  fontSize: 11,
  border: '1px solid #E8E0D4',
  borderRadius: 5,
  background: '#FEFCF9',
  color: '#2D2A26',
  cursor: 'pointer',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  outline: 'none',
};

const ExportBar: React.FC<ExportBarProps> = ({ chartRef, title }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [dpi, setDpi] = useState(3);

  const slug = (title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const wrap = async (label: string, fn: () => Promise<void>) => {
    if (!chartRef.current) return;
    try {
      setStatus(`Exporting ${label}...`);
      await fn();
      setStatus(null);
    } catch (err) {
      console.error(`${label} export failed:`, err);
      setStatus(`${label} export failed — try another format`);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div style={{ padding: '14px 0 0' }}>
      {/* Primary row: PNG, PDF, PPTX */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button style={btnPrimaryStyle} onClick={() => wrap('PNG', () => exportPng(chartRef.current!, `${slug}.png`, dpi))}>
          <Image size={14} /> PNG
        </button>
        <button style={btnPrimaryStyle} onClick={() => wrap('PDF', () => exportPdf(chartRef.current!, `${slug}.pdf`, title))}>
          <FileText size={14} /> PDF
        </button>
        <button style={btnPrimaryStyle} onClick={() => wrap('PPTX', () => exportPptx(chartRef.current!, `${slug}.pptx`, title))}>
          <Presentation size={14} /> PPTX
        </button>
        <select
          style={selectStyle}
          value={dpi}
          onChange={(e) => setDpi(parseInt(e.target.value))}
          title="PNG resolution"
        >
          {DPI_OPTIONS.map((opt) => (
            <option key={opt.ratio} value={opt.ratio}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Secondary row: SVG, HTML, Embed */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        <button style={btnStyle} onClick={() => wrap('SVG', () => exportSvg(chartRef.current!, `${slug}.svg`))}>
          <Download size={14} /> SVG
        </button>
        <button style={btnStyle} onClick={() => { if (chartRef.current) exportHtml(chartRef.current, `${slug}.html`); }}>
          <Code size={14} /> HTML
        </button>
        <button
          style={btnStyle}
          onClick={async () => {
            if (!chartRef.current) return;
            try {
              await copyEmbedCode(chartRef.current);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setStatus('Copy failed');
              setTimeout(() => setStatus(null), 3000);
            }
          }}
        >
          <Copy size={14} /> {copied ? 'Copied!' : 'Embed'}
        </button>
      </div>

      {status && (
        <p style={{ fontSize: 12, color: status.includes('failed') ? '#B91C1C' : '#7A7468', margin: '6px 0 0' }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default ExportBar;
