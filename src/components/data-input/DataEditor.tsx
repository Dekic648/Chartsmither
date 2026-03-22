import React, { useRef, useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { ChartTypeId, ChartData, DataShape } from '../../types/chart';
import { CHART_CATALOGUE } from '../../types/catalogue';
import { getAlternateSampleData } from '../../utils/sampleData';
import { smartParse, validateData, detectFormat } from '../../utils/dataTransform';

interface DataEditorProps {
  chartTypeId: ChartTypeId;
  data: ChartData;
  onChange: (data: ChartData) => void;
  onLoadSample?: () => void;
}

const DATA_SHAPE_HINTS: Record<DataShape, string> = {
  'single-series': '{ labels: string[], series: [{ name, data: number[] }] }',
  'multi-series': '{ labels: string[], series: [{ name, data: number[] }, ...] }',
  xy: '{ points: [{ x, y, label? }, ...] }',
  xyz: '{ points: [{ x, y, z, label? }, ...] }',
  matrix: '{ matrix: { rows: string[], cols: string[], values: number[][] } }',
  hierarchical: '{ items: [{ label, value }, ...] }',
  'key-value': '{ items: [{ label, value }, ...] }',
  range: '{ items: [{ label, min, max }, ...] }',
  distribution: '{ raw: number[] }',
  'weighted-text': '{ items: [{ label, value }, ...] }',
  pyramid: '{ items: [{ label, left, right }, ...] }',
  bullet: '{ items: [{ label, value, target, ranges }, ...] }',
  waterfall: '{ items: [{ label, value, type }, ...] }',
  flow: '{ items: [{ label, source, target, value }, ...] }',
  network: '{ items: [{ label, value, connections: string[] }, ...] }',
  gantt: '{ items: [{ label, value, start, end, category? }, ...] }',
  'timeline-events': '{ items: [{ label, value (year), description? }, ...] }',
  error: '{ items: [{ label, value, error }, ...] }',
  venn: '{ items: [{ label, value }, ...] }',
  geo: '{ items: [{ label (country code), value }, ...] }',
};

const SHAPE_EXAMPLES: Partial<Record<DataShape, string>> = {
  'single-series': 'Paste a table with one header row:\nYear, GDP\n2020, 21.4\n2021, 23.0\n2022, 25.5',
  'multi-series': 'Paste a table with multiple columns:\nYear, US, UK, Germany\n2020, 2.3, 1.8, 1.4\n2021, 4.7, 2.5, 3.1',
  xy: 'Paste two columns (x and y):\nGDP, LifeExp\n45000, 78.5\n12000, 72.1',
  'key-value': 'Paste two columns:\nCountry, Value\nUnited States, 25.5\nChina, 18.3',
  distribution: 'Paste one number per line:\n45200\n52100\n38900\n67300',
  geo: 'Paste country codes and values:\nCode, Value\nUS, 63544\nGB, 42300\nDE, 48636',
};

export default function DataEditor({ chartTypeId, data, onChange, onLoadSample }: DataEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const meta = CHART_CATALOGUE.find((c) => c.id === chartTypeId);
  const dataShape = meta?.dataShape ?? 'single-series';

  const [rawText, setRawText] = useState('');
  const [editMode, setEditMode] = useState<'json' | 'paste'>('paste');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const jsonText = JSON.stringify(data, null, 2);

  // Validate current data
  const currentValidation = validateData(data, dataShape);

  const handleJsonChange = (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as ChartData;
      const val = validateData(parsed, dataShape);

      if (val.valid) {
        setFeedback(null);
      } else {
        setFeedback({ type: 'warning', message: val.errors[0] || val.warnings[0] });
      }
      onChange(parsed);
    } catch {
      // Allow partial edits — don't clobber
      setFeedback({ type: 'error', message: 'Invalid JSON — keep typing' });
    }
  };

  const handleSmartPaste = useCallback(() => {
    if (!rawText.trim()) {
      setFeedback({ type: 'error', message: 'Paste some data first' });
      return;
    }

    const result = smartParse(rawText, dataShape);
    if (result.data) {
      validateData(result.data, dataShape);
      onChange(result.data);
      setFeedback({ type: 'success', message: result.message });
      setEditMode('json');
      setRawText('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  }, [rawText, dataShape, onChange]);

  const handlePasteEvent = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text.trim()) return;

    // Auto-switch to paste mode if tabular data detected in JSON mode
    const format = detectFormat(text);
    if (editMode !== 'paste') {
      if (format === 'csv' || format === 'tsv' || format === 'single-column') {
        setEditMode('paste');
        // Fall through to auto-convert below
      } else {
        return;
      }
    }

    if (format === 'csv' || format === 'tsv' || format === 'single-column') {
      // Auto-convert on paste
      e.preventDefault();
      setRawText(text);
      const result = smartParse(text, dataShape);
      if (result.data) {
        onChange(result.data);
        setFeedback({ type: 'success', message: result.message });
        setEditMode('json');
        setRawText('');
      } else {
        setRawText(text);
        setFeedback({ type: 'warning', message: `Detected ${format.toUpperCase()} but couldn't auto-convert. Click "Convert" to try.` });
      }
    }
  }, [editMode, dataShape, onChange]);

  const handleCsvUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete(results) {
        const rows = results.data as Record<string, unknown>[];
        if (!rows.length) return;
        // Use smart parse's tabular logic by converting back to CSV text
        const csvText = Papa.unparse(rows);
        const result = smartParse(csvText, dataShape);
        if (result.data) {
          onChange(result.data);
          setFeedback({ type: 'success', message: `Imported ${file.name}: ${result.message}` });
        } else {
          setFeedback({ type: 'error', message: `Could not convert ${file.name} to expected format` });
        }
      },
    });
  };

  const handleLoadSample = () => {
    if (onLoadSample) {
      onLoadSample();
    } else {
      onChange(getAlternateSampleData(chartTypeId));
    }
    setFeedback({ type: 'success', message: 'Sample data changed' });
  };

  return (
    <div style={s.container}>
      <p style={s.header}>Data</p>

      {/* Mode tabs */}
      <div style={s.tabRow}>
        <button
          style={editMode === 'paste' ? s.tabActive : s.tab}
          onClick={() => setEditMode('paste')}
        >
          Paste data
        </button>
        <button
          style={editMode === 'json' ? s.tabActive : s.tab}
          onClick={() => setEditMode('json')}
        >
          Edit JSON
        </button>
      </div>

      {editMode === 'paste' ? (
        <>
          {/* Paste mode — friendly, default view */}
          <div style={s.pasteInstructions}>
            <p style={s.pasteTitle}>Paste from Excel, Sheets, or anywhere</p>
            <p style={s.pasteDesc}>
              Copy a table from a spreadsheet and paste below. We'll auto-detect columns and format.
            </p>
            {SHAPE_EXAMPLES[dataShape] && (
              <pre style={s.pasteExample}>{SHAPE_EXAMPLES[dataShape]}</pre>
            )}
          </div>

          <textarea
            style={s.textarea}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            onPaste={handlePasteEvent}
            placeholder="Paste your data here..."
            spellCheck={false}
          />

          {rawText.trim() && (
            <button style={s.buttonPrimary} onClick={handleSmartPaste}>
              Convert to chart data
            </button>
          )}
        </>
      ) : (
        <>
          {/* JSON editor — power user view */}
          <p style={s.label}>Expected shape ({dataShape})</p>
          <pre style={s.hint}>{DATA_SHAPE_HINTS[dataShape]}</pre>

          <textarea
            style={{
              ...s.textarea,
              borderColor: !currentValidation.valid ? '#E3120B' : '#E8E0D4',
            }}
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            spellCheck={false}
          />

          {!currentValidation.valid && currentValidation.errors.length > 0 && (
            <div style={s.errorBox}>
              {currentValidation.errors.map((err, i) => (
                <p key={i} style={s.errorText}>{err}</p>
              ))}
            </div>
          )}
          {currentValidation.warnings.length > 0 && (
            <div style={s.warningBox}>
              {currentValidation.warnings.map((w, i) => (
                <p key={i} style={s.warningText}>{w}</p>
              ))}
            </div>
          )}
        </>
      )}

      {/* Feedback message */}
      {feedback && (
        <div style={feedback.type === 'success' ? s.successBox : feedback.type === 'warning' ? s.warningBox : s.errorBox}>
          <p style={feedback.type === 'success' ? s.successText : feedback.type === 'warning' ? s.warningText : s.errorText}>
            {feedback.message}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={s.buttonRow}>
        <button style={s.button} onClick={handleLoadSample}>
          Change sample data
        </button>
        <button
          style={s.button}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt,.json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCsvUpload(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────

const s = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: '#FFFFFF',
    border: '1px solid #E8E0D4',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(60, 45, 20, 0.04)',
  },
  header: {
    fontSize: '12px',
    fontWeight: 700 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#1A1714',
    margin: '0 0 4px',
    paddingBottom: '10px',
    borderBottom: '1px solid #EDE7DD',
  } as React.CSSProperties,
  tabRow: {
    display: 'flex',
    gap: '0px',
    borderBottom: '1px solid #EDE7DD',
    marginBottom: '8px',
  },
  tab: {
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: 500 as const,
    border: 'none',
    borderBottom: '2px solid transparent',
    background: 'none',
    color: '#9B9488',
    cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: 'color 0.15s, border-color 0.15s',
  } as React.CSSProperties,
  tabActive: {
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: 600 as const,
    border: 'none',
    borderBottom: '2px solid #E3120B',
    background: 'none',
    color: '#1A1714',
    cursor: 'pointer',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
  label: {
    fontSize: '11px',
    fontWeight: 600 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#9B9488',
    margin: 0,
  } as React.CSSProperties,
  hint: {
    fontSize: '11.5px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    color: '#9B9488',
    background: '#FAF4EA',
    padding: '8px 8px',
    borderRadius: '4px',
    margin: 0,
    lineHeight: 1.5,
    overflowX: 'auto' as const,
    border: '1px solid #EDE7DD',
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    minHeight: '180px',
    padding: '12px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    fontSize: '12px',
    lineHeight: 1.6,
    border: '1px solid #E8E0D4',
    borderRadius: '6px',
    resize: 'vertical' as const,
    background: '#FEFCF9',
    color: '#2D2A26',
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  buttonRow: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600 as const,
    border: '1px solid #E8E0D4',
    borderRadius: '5px',
    background: '#FFFFFF',
    color: '#2D2A26',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
  buttonPrimary: {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: 600 as const,
    border: '1px solid #E3120B',
    borderRadius: '5px',
    background: '#E3120B',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
  pasteInstructions: {
    background: '#FAF4EA',
    border: '1px solid #EDE7DD',
    borderRadius: '6px',
    padding: '12px 14px',
  },
  pasteTitle: {
    fontSize: '13px',
    fontWeight: 600 as const,
    color: '#1A1714',
    margin: '0 0 4px',
  } as React.CSSProperties,
  pasteDesc: {
    fontSize: '12px',
    color: '#7A7468',
    margin: '0 0 8px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  pasteExample: {
    fontSize: '11px',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    color: '#9B9488',
    margin: 0,
    lineHeight: 1.6,
    whiteSpace: 'pre' as const,
  } as React.CSSProperties,
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '5px',
    padding: '8px 8px',
  },
  errorText: {
    fontSize: '12px',
    color: '#B91C1C',
    margin: 0,
    lineHeight: 1.5,
  } as React.CSSProperties,
  warningBox: {
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: '5px',
    padding: '8px 8px',
  },
  warningText: {
    fontSize: '12px',
    color: '#92400E',
    margin: 0,
    lineHeight: 1.5,
  } as React.CSSProperties,
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '5px',
    padding: '8px 8px',
  },
  successText: {
    fontSize: '12px',
    color: '#166534',
    margin: 0,
    lineHeight: 1.5,
  } as React.CSSProperties,
};
