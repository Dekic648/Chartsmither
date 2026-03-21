import Papa from 'papaparse';
import type { ChartData, DataShape } from '../types/chart';

/**
 * Detect what format raw text is in.
 */
type DetectedFormat = 'json' | 'csv' | 'tsv' | 'single-column' | 'unknown';

export function detectFormat(raw: string): DetectedFormat {
  const trimmed = raw.trim();
  if (!trimmed) return 'unknown';

  // JSON object or array
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch { /* fall through */ }
  }

  // Check for tabs (Excel / Google Sheets paste)
  if (trimmed.includes('\t')) return 'tsv';

  // Check for commas with multiple lines (CSV)
  const lines = trimmed.split('\n').filter(l => l.trim());
  if (lines.length > 1 && lines[0].includes(',') && lines[1].includes(',')) return 'csv';

  // Single column of numbers
  if (lines.length > 1 && lines.every(l => !isNaN(Number(l.trim())))) return 'single-column';

  return 'unknown';
}

/**
 * Parse tabular text (CSV or TSV) into rows.
 */
function parseTabular(raw: string, delimiter?: string): { headers: string[]; rows: Record<string, unknown>[] } {
  const result = Papa.parse(raw.trim(), {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    delimiter,
  });
  const headers = result.meta.fields || [];
  const rows = result.data as Record<string, unknown>[];
  return { headers, rows };
}

/**
 * Convert tabular data to ChartData based on target shape.
 */
function tabularToChartData(
  headers: string[],
  rows: Record<string, unknown>[],
  targetShape: DataShape,
): ChartData | null {
  if (!rows.length || !headers.length) return null;

  const labelKey = headers[0];
  const numericKeys = headers.slice(1).filter(k =>
    rows.some(r => typeof r[k] === 'number' || !isNaN(Number(r[k])))
  );

  switch (targetShape) {
    case 'single-series':
    case 'multi-series': {
      const labels = rows.map(r => String(r[labelKey] ?? ''));
      const series = (numericKeys.length > 0 ? numericKeys : headers.slice(1)).map(key => ({
        name: key,
        data: rows.map(r => Number(r[key]) || 0),
      }));
      return { labels, series };
    }

    case 'xy': {
      const xKey = headers[0];
      const yKey = headers[1] || headers[0];
      const labelKeyXY = headers[2];
      return {
        points: rows.map(r => ({
          x: Number(r[xKey]) || 0,
          y: Number(r[yKey]) || 0,
          label: labelKeyXY ? String(r[labelKeyXY] || '') : undefined,
        })),
      };
    }

    case 'xyz': {
      const [xK, yK, zK] = headers;
      return {
        points: rows.map(r => ({
          x: Number(r[xK]) || 0,
          y: Number(r[yK]) || 0,
          z: Number(r[zK]) || 0,
          label: headers[3] ? String(r[headers[3]] || '') : undefined,
        })),
      };
    }

    case 'key-value':
    case 'hierarchical':
    case 'weighted-text':
    case 'venn':
    case 'geo': {
      const valKey = numericKeys[0] || headers[1];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[valKey]) || 0,
        })),
      };
    }

    case 'range': {
      const minKey = headers.find(h => h.toLowerCase().includes('min')) || headers[1];
      const maxKey = headers.find(h => h.toLowerCase().includes('max')) || headers[2];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: 0,
          min: Number(r[minKey as string]) || 0,
          max: Number(r[maxKey as string]) || 0,
        })),
      };
    }

    case 'error': {
      const valK = headers.find(h => h.toLowerCase().includes('val')) || headers[1];
      const errK = headers.find(h => h.toLowerCase().includes('err')) || headers[2];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[valK as string]) || 0,
          error: Number(r[errK as string]) || 0,
        })),
      };
    }

    case 'pyramid': {
      const leftK = headers.find(h => h.toLowerCase().includes('left') || h.toLowerCase().includes('male')) || headers[1];
      const rightK = headers.find(h => h.toLowerCase().includes('right') || h.toLowerCase().includes('female')) || headers[2];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: 0,
          left: Number(r[leftK as string]) || 0,
          right: Number(r[rightK as string]) || 0,
        })),
      };
    }

    case 'flow': {
      const srcK = headers.find(h => h.toLowerCase().includes('source') || h.toLowerCase().includes('from')) || headers[0];
      const tgtK = headers.find(h => h.toLowerCase().includes('target') || h.toLowerCase().includes('to')) || headers[1];
      const flValK = headers.find(h => h.toLowerCase().includes('val') || h.toLowerCase().includes('amount')) || headers[2];
      return {
        items: rows.map(r => ({
          label: `${r[srcK]}-${r[tgtK]}`,
          value: Number(r[flValK as string]) || 0,
          source: String(r[srcK] ?? ''),
          target: String(r[tgtK] ?? ''),
        })),
      };
    }

    case 'gantt': {
      const startK = headers.find(h => h.toLowerCase().includes('start')) || headers[1];
      const endK = headers.find(h => h.toLowerCase().includes('end')) || headers[2];
      const catK = headers.find(h => h.toLowerCase().includes('cat') || h.toLowerCase().includes('phase'));
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: 0,
          start: Number(r[startK as string]) || 0,
          end: Number(r[endK as string]) || 0,
          ...(catK ? { category: String(r[catK] ?? '') } : {}),
        })),
      };
    }

    case 'timeline-events': {
      const yearK = numericKeys[0] || headers[1];
      const descK = headers.find(h => h.toLowerCase().includes('desc') || h.toLowerCase().includes('note'));
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[yearK as string]) || 0,
          ...(descK ? { description: String(r[descK] ?? '') } : {}),
        })),
      };
    }

    case 'distribution': {
      // Flatten all numeric values into raw array
      const allNums: number[] = [];
      for (const r of rows) {
        for (const k of headers) {
          const v = Number(r[k]);
          if (!isNaN(v)) allNums.push(v);
        }
      }
      return { raw: allNums };
    }

    case 'matrix': {
      const rowLabels = rows.map(r => String(r[labelKey] ?? ''));
      const colLabels = numericKeys.length > 0 ? numericKeys : headers.slice(1);
      const values = rows.map(r => colLabels.map(k => Number(r[k]) || 0));
      return { matrix: { rows: rowLabels, cols: colLabels, values } };
    }

    case 'waterfall': {
      const typeK = headers.find(h => h.toLowerCase().includes('type')) || headers[2];
      const wfValK = numericKeys[0] || headers[1];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[wfValK as string]) || 0,
          type: String(r[typeK as string] ?? 'increase'),
        })),
      };
    }

    case 'bullet': {
      const bValK = headers.find(h => h.toLowerCase() === 'value' || h.toLowerCase() === 'actual') || headers[1];
      const tgtKeyB = headers.find(h => h.toLowerCase().includes('target')) || headers[2];
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[bValK as string]) || 0,
          target: Number(r[tgtKeyB as string]) || 0,
          ranges: [50, 75, 100],
        })),
      };
    }

    case 'network': {
      return {
        items: rows.map(r => ({
          label: String(r[labelKey] ?? ''),
          value: Number(r[numericKeys[0] || headers[1]] ?? 10),
          connections: headers.slice(numericKeys.length > 0 ? 2 : 1)
            .filter(k => typeof r[k] === 'string' && (r[k] as string).trim())
            .map(k => String(r[k])),
        })),
      };
    }

    default:
      return null;
  }
}

/**
 * Validate that ChartData has the required fields for a given shape.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateData(data: ChartData, shape: DataShape): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (shape) {
    case 'single-series':
    case 'multi-series':
      if (!data.labels || !data.labels.length) errors.push('Missing "labels" array');
      if (!data.series || !data.series.length) errors.push('Missing "series" array');
      else {
        for (const s of data.series) {
          if (!s.name) warnings.push('Series missing "name"');
          if (!s.data || !s.data.length) errors.push(`Series "${s.name || '?'}" has no data`);
        }
        if (data.labels && data.series[0]?.data && data.labels.length !== data.series[0].data.length) {
          warnings.push(`Labels count (${data.labels.length}) doesn't match data length (${data.series[0].data.length})`);
        }
      }
      break;

    case 'xy':
    case 'xyz':
      if (!data.points || !data.points.length) errors.push('Missing "points" array');
      else if (shape === 'xyz' && data.points.some(p => p.z === undefined)) {
        warnings.push('Some points missing "z" value for bubble size');
      }
      break;

    case 'matrix':
      if (!data.matrix) errors.push('Missing "matrix" object');
      else {
        if (!data.matrix.rows?.length) errors.push('Matrix missing "rows"');
        if (!data.matrix.cols?.length) errors.push('Matrix missing "cols"');
        if (!data.matrix.values?.length) errors.push('Matrix missing "values"');
      }
      break;

    case 'distribution':
      if (!data.raw || !data.raw.length) errors.push('Missing "raw" number array');
      break;

    case 'key-value':
    case 'hierarchical':
    case 'weighted-text':
    case 'range':
    case 'pyramid':
    case 'bullet':
    case 'waterfall':
    case 'flow':
    case 'network':
    case 'gantt':
    case 'timeline-events':
    case 'error':
    case 'venn':
    case 'geo':
      if (!data.items || !data.items.length) errors.push('Missing "items" array');
      break;
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Smart parse: detect format and convert to ChartData.
 */
export function smartParse(raw: string, targetShape: DataShape): {
  data: ChartData | null;
  format: DetectedFormat;
  message: string;
} {
  const format = detectFormat(raw);

  switch (format) {
    case 'json': {
      try {
        const parsed = JSON.parse(raw.trim());

        // If it's already a ChartData-shaped object, return as-is
        if (parsed.labels || parsed.series || parsed.points || parsed.matrix || parsed.items || parsed.raw) {
          return { data: parsed as ChartData, format, message: 'Valid JSON data loaded' };
        }

        // If it's an array of objects, treat as tabular
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
          const headers = Object.keys(parsed[0]);
          const chartData = tabularToChartData(headers, parsed, targetShape);
          if (chartData) {
            return { data: chartData, format, message: `Converted JSON array (${parsed.length} rows) to ${targetShape}` };
          }
        }

        // If it's a plain array of numbers
        if (Array.isArray(parsed) && parsed.every((v: unknown) => typeof v === 'number')) {
          if (targetShape === 'distribution') {
            return { data: { raw: parsed }, format, message: `Loaded ${parsed.length} values` };
          }
          return {
            data: {
              labels: parsed.map((_: unknown, i: number) => String(i + 1)),
              series: [{ name: 'Values', data: parsed }],
            },
            format,
            message: `Converted number array to series data`,
          };
        }

        return { data: parsed as ChartData, format, message: 'JSON loaded (may need reshaping)' };
      } catch {
        return { data: null, format: 'unknown', message: 'Invalid JSON' };
      }
    }

    case 'csv':
    case 'tsv': {
      const delimiter = format === 'tsv' ? '\t' : ',';
      const { headers, rows } = parseTabular(raw, delimiter);
      const chartData = tabularToChartData(headers, rows, targetShape);
      if (chartData) {
        return {
          data: chartData,
          format,
          message: `Converted ${format.toUpperCase()} (${rows.length} rows, ${headers.length} columns) to ${targetShape}`,
        };
      }
      return { data: null, format, message: `Could not convert ${format.toUpperCase()} to ${targetShape}` };
    }

    case 'single-column': {
      const nums = raw.trim().split('\n').map(l => Number(l.trim())).filter(n => !isNaN(n));
      if (targetShape === 'distribution') {
        return { data: { raw: nums }, format, message: `Loaded ${nums.length} values` };
      }
      return {
        data: {
          labels: nums.map((_, i) => String(i + 1)),
          series: [{ name: 'Values', data: nums }],
        },
        format,
        message: `Converted ${nums.length} numbers to series data`,
      };
    }

    default:
      return { data: null, format, message: 'Could not detect data format. Try JSON, CSV, or tab-separated values.' };
  }
}
