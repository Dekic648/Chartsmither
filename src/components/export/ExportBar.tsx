import React, { useState } from 'react';
import { Download, Copy, Code, Image } from 'lucide-react';
import { exportPng, exportSvg, exportHtml, copyEmbedCode } from '../../utils/export';

interface ExportBarProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  title?: string;
}

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

const ExportBar: React.FC<ExportBarProps> = ({ chartRef, title }) => {
  const [copied, setCopied] = useState(false);

  const slug = (title || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handlePng = async () => {
    if (!chartRef.current) return;
    await exportPng(chartRef.current, `${slug}.png`);
  };

  const handleSvg = async () => {
    if (!chartRef.current) return;
    await exportSvg(chartRef.current, `${slug}.svg`);
  };

  const handleHtml = () => {
    if (!chartRef.current) return;
    exportHtml(chartRef.current, `${slug}.html`);
  };

  const handleCopy = () => {
    if (!chartRef.current) return;
    copyEmbedCode(chartRef.current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 0 0' }}>
      <button style={btnStyle} onClick={handlePng}>
        <Image size={14} /> PNG (3x)
      </button>
      <button style={btnStyle} onClick={handleSvg}>
        <Download size={14} /> SVG
      </button>
      <button style={btnStyle} onClick={handleHtml}>
        <Code size={14} /> HTML
      </button>
      <button style={btnStyle} onClick={handleCopy}>
        <Copy size={14} /> {copied ? 'Copied!' : 'Embed code'}
      </button>
    </div>
  );
};

export default ExportBar;
