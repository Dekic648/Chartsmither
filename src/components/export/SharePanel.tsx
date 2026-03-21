import React, { useState, useMemo } from 'react';
import { Link2, Code, Check } from 'lucide-react';
import type { ChartData, ChartOptions } from '../../types/chart';
import { getShareUrl, getEmbedCode, copyToClipboard } from '../../utils/share';

interface SharePanelProps {
  typeId: string;
  data: ChartData;
  options: ChartOptions;
}

const btnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 14px',
  fontSize: 12,
  fontWeight: 600,
  border: '1px solid #E8E0D4',
  borderRadius: 5,
  background: '#FFFFFF',
  color: '#2D2A26',
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const SharePanel: React.FC<SharePanelProps> = ({ typeId, data, options }) => {
  const [copied, setCopied] = useState<'url' | 'embed' | null>(null);

  const shareUrl = useMemo(() => getShareUrl(typeId, data, options), [typeId, data, options]);
  const embedCode = useMemo(() => getEmbedCode(typeId, data, options), [typeId, data, options]);

  const handleCopy = async (type: 'url' | 'embed') => {
    const text = type === 'url' ? shareUrl : embedCode;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8E0D4',
        borderRadius: 8,
        padding: 18,
        boxShadow: '0 1px 4px rgba(60, 45, 20, 0.04)',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#1A1714',
          margin: '0 0 14px',
          paddingBottom: 10,
          borderBottom: '1px solid #EDE7DD',
        }}
      >
        Share
      </p>

      {/* Share URL */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#9B9488',
            display: 'block',
            marginBottom: 4,
          }}
        >
          Shareable link
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              padding: '7px 10px',
              fontSize: 12,
              border: '1px solid #E8E0D4',
              borderRadius: 5,
              background: '#FEFCF9',
              color: '#2D2A26',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              outline: 'none',
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button style={btnStyle} onClick={() => handleCopy('url')}>
            {copied === 'url' ? <Check size={13} /> : <Link2 size={13} />}
            {copied === 'url' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Embed code */}
      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#9B9488',
            display: 'block',
            marginBottom: 4,
          }}
        >
          Embed code
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            readOnly
            value={embedCode}
            style={{
              flex: 1,
              padding: '7px 10px',
              fontSize: 12,
              border: '1px solid #E8E0D4',
              borderRadius: 5,
              background: '#FEFCF9',
              color: '#2D2A26',
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              outline: 'none',
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button style={btnStyle} onClick={() => handleCopy('embed')}>
            {copied === 'embed' ? <Check size={13} /> : <Code size={13} />}
            {copied === 'embed' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePanel;
