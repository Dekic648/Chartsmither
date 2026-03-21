import { describe, it, expect } from 'vitest';
import { detectFormat, smartParse, validateData } from './dataTransform';
import type { DataShape } from '../types/chart';

// ─────────────────────────────────────────────────────
// detectFormat
// ─────────────────────────────────────────────────────

describe('detectFormat', () => {
  it('detects JSON objects', () => {
    expect(detectFormat('{ "labels": ["a"] }')).toBe('json');
  });

  it('detects JSON arrays', () => {
    expect(detectFormat('[1, 2, 3]')).toBe('json');
  });

  it('detects CSV', () => {
    expect(detectFormat('Year,GDP,Pop\n2020,21.4,330\n2021,23.0,332')).toBe('csv');
  });

  it('detects TSV (Excel paste)', () => {
    expect(detectFormat('Year\tGDP\tPop\n2020\t21.4\t330\n2021\t23.0\t332')).toBe('tsv');
  });

  it('detects single column of numbers', () => {
    expect(detectFormat('45200\n52100\n38900\n67300')).toBe('single-column');
  });

  it('returns unknown for random text', () => {
    expect(detectFormat('hello world this is not data')).toBe('unknown');
  });

  it('returns unknown for empty string', () => {
    expect(detectFormat('')).toBe('unknown');
  });

  it('handles malformed JSON gracefully', () => {
    expect(detectFormat('{ broken json')).not.toBe('json');
  });
});

// ─────────────────────────────────────────────────────
// smartParse — CSV
// ─────────────────────────────────────────────────────

describe('smartParse — CSV to single-series', () => {
  const csv = 'Year,GDP\n2020,21.4\n2021,23.0\n2022,25.5';

  it('converts CSV to single-series', () => {
    const result = smartParse(csv, 'single-series');
    expect(result.data).not.toBeNull();
    expect(result.format).toBe('csv');
    expect(result.data!.labels).toEqual(['2020', '2021', '2022']);
    expect(result.data!.series).toHaveLength(1);
    expect(result.data!.series![0].name).toBe('GDP');
    expect(result.data!.series![0].data).toEqual([21.4, 23.0, 25.5]);
  });
});

describe('smartParse — CSV to multi-series', () => {
  const csv = 'Year,US,UK,Germany\n2020,2.3,1.8,1.4\n2021,4.7,2.5,3.1\n2022,8.0,9.1,8.7';

  it('converts CSV to multi-series with correct labels and 3 series', () => {
    const result = smartParse(csv, 'multi-series');
    expect(result.data).not.toBeNull();
    expect(result.data!.labels).toEqual(['2020', '2021', '2022']);
    expect(result.data!.series).toHaveLength(3);
    expect(result.data!.series![0].name).toBe('US');
    expect(result.data!.series![1].name).toBe('UK');
    expect(result.data!.series![2].name).toBe('Germany');
    expect(result.data!.series![0].data).toEqual([2.3, 4.7, 8.0]);
  });
});

describe('smartParse — CSV to key-value', () => {
  const csv = 'Country,Value\nUnited States,25.5\nChina,18.3\nJapan,4.2';

  it('converts CSV to key-value items', () => {
    const result = smartParse(csv, 'key-value');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toEqual({ label: 'United States', value: 25.5 });
    expect(result.data!.items![2]).toEqual({ label: 'Japan', value: 4.2 });
  });
});

describe('smartParse — CSV to xy scatter', () => {
  const csv = 'GDP,LifeExp\n45000,78.5\n12000,72.1\n65000,82.3';

  it('converts CSV to xy points', () => {
    const result = smartParse(csv, 'xy');
    expect(result.data).not.toBeNull();
    expect(result.data!.points).toHaveLength(3);
    expect(result.data!.points![0]).toMatchObject({ x: 45000, y: 78.5 });
  });
});

// ─────────────────────────────────────────────────────
// smartParse — TSV (Excel paste)
// ─────────────────────────────────────────────────────

describe('smartParse — TSV (Excel paste)', () => {
  const tsv = 'Region\tQ1\tQ2\tQ3\nNorth\t120\t135\t150\nSouth\t90\t95\t110';

  it('converts TSV to multi-series', () => {
    const result = smartParse(tsv, 'multi-series');
    expect(result.data).not.toBeNull();
    expect(result.format).toBe('tsv');
    expect(result.data!.labels).toEqual(['North', 'South']);
    expect(result.data!.series).toHaveLength(3);
    expect(result.data!.series![0].name).toBe('Q1');
    expect(result.data!.series![0].data).toEqual([120, 90]);
  });
});

// ─────────────────────────────────────────────────────
// smartParse — single column of numbers
// ─────────────────────────────────────────────────────

describe('smartParse — single column numbers', () => {
  const nums = '45200\n52100\n38900\n67300\n41000';

  it('converts to distribution (raw)', () => {
    const result = smartParse(nums, 'distribution');
    expect(result.data).not.toBeNull();
    expect(result.data!.raw).toEqual([45200, 52100, 38900, 67300, 41000]);
  });

  it('converts to single-series for bar charts', () => {
    const result = smartParse(nums, 'single-series');
    expect(result.data).not.toBeNull();
    expect(result.data!.labels).toHaveLength(5);
    expect(result.data!.series![0].data).toEqual([45200, 52100, 38900, 67300, 41000]);
  });
});

// ─────────────────────────────────────────────────────
// smartParse — JSON inputs
// ─────────────────────────────────────────────────────

describe('smartParse — JSON', () => {
  it('passes through valid ChartData JSON', () => {
    const json = JSON.stringify({
      labels: ['A', 'B'],
      series: [{ name: 'S1', data: [10, 20] }],
    });
    const result = smartParse(json, 'single-series');
    expect(result.data).not.toBeNull();
    expect(result.data!.labels).toEqual(['A', 'B']);
  });

  it('converts JSON array of objects to key-value', () => {
    const json = JSON.stringify([
      { Country: 'US', GDP: 25.5 },
      { Country: 'China', GDP: 18.3 },
    ]);
    const result = smartParse(json, 'key-value');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(2);
    expect(result.data!.items![0].label).toBe('US');
    expect(result.data!.items![0].value).toBe(25.5);
  });

  it('converts JSON number array to distribution', () => {
    const json = '[10, 20, 30, 40, 50]';
    const result = smartParse(json, 'distribution');
    expect(result.data).not.toBeNull();
    expect(result.data!.raw).toEqual([10, 20, 30, 40, 50]);
  });
});

// ─────────────────────────────────────────────────────
// smartParse — specialized shapes
// ─────────────────────────────────────────────────────

describe('smartParse — flow data', () => {
  const csv = 'Source,Target,Value\nCoal,Electricity,25\nGas,Electricity,18\nOil,Transport,30';

  it('converts CSV with source/target columns to flow', () => {
    const result = smartParse(csv, 'flow');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({
      source: 'Coal',
      target: 'Electricity',
      value: 25,
    });
  });
});

describe('smartParse — error bars', () => {
  const csv = 'Treatment,Value,Error\nDrug A,45,8\nDrug B,52,6\nPlacebo,30,10';

  it('converts CSV with value/error columns', () => {
    const result = smartParse(csv, 'error');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({ label: 'Drug A', value: 45, error: 8 });
  });
});

describe('smartParse — gantt', () => {
  const csv = 'Task,Start,End,Category\nResearch,0,3,Planning\nDesign,2,5,Design\nBuild,4,8,Dev';

  it('converts CSV with start/end columns to gantt', () => {
    const result = smartParse(csv, 'gantt');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({
      label: 'Research',
      start: 0,
      end: 3,
      category: 'Planning',
    });
  });
});

describe('smartParse — range/span', () => {
  const csv = 'City,Min,Max\nNew York,28000,95000\nLondon,32000,88000\nTokyo,30000,92000';

  it('converts CSV with min/max columns to range', () => {
    const result = smartParse(csv, 'range');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({ label: 'New York', min: 28000, max: 95000 });
  });
});

describe('smartParse — pyramid', () => {
  const csv = 'Age,Male,Female\n0-9,5.2,4.9\n10-19,5.5,5.3\n20-29,6.1,5.8';

  it('converts CSV with male/female columns to pyramid', () => {
    const result = smartParse(csv, 'pyramid');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({ label: '0-9', left: 5.2, right: 4.9 });
  });
});

describe('smartParse — geo/map', () => {
  const csv = 'Code,Value\nUS,63544\nGB,42300\nDE,48636\nJP,39285';

  it('converts CSV to geo items', () => {
    const result = smartParse(csv, 'geo');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(4);
    expect(result.data!.items![0]).toEqual({ label: 'US', value: 63544 });
  });
});

describe('smartParse — matrix', () => {
  const csv = 'Country,GDP,HDI,CO2\nUS,65000,0.92,15.5\nChina,12000,0.77,7.4\nGermany,48000,0.95,8.1';

  it('converts CSV to matrix', () => {
    const result = smartParse(csv, 'matrix');
    expect(result.data).not.toBeNull();
    expect(result.data!.matrix!.rows).toEqual(['US', 'China', 'Germany']);
    expect(result.data!.matrix!.cols).toEqual(['GDP', 'HDI', 'CO2']);
    expect(result.data!.matrix!.values[0]).toEqual([65000, 0.92, 15.5]);
  });
});

describe('smartParse — waterfall', () => {
  const csv = 'Item,Value,Type\nRevenue,1000,total\nCOGS,-400,decrease\nGross Profit,600,total';

  it('converts CSV with type column to waterfall', () => {
    const result = smartParse(csv, 'waterfall');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![0]).toMatchObject({ label: 'Revenue', value: 1000, type: 'total' });
    expect(result.data!.items![1]).toMatchObject({ label: 'COGS', value: -400, type: 'decrease' });
  });
});

describe('smartParse — timeline', () => {
  const csv = 'Event,Year,Description\niPhone,2007,Apple launches iPhone\niPad,2010,Apple launches iPad';

  it('converts CSV to timeline events', () => {
    const result = smartParse(csv, 'timeline-events');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(2);
    expect(result.data!.items![0]).toMatchObject({
      label: 'iPhone',
      value: 2007,
      description: 'Apple launches iPhone',
    });
  });
});

// ─────────────────────────────────────────────────────
// smartParse — edge cases
// ─────────────────────────────────────────────────────

describe('smartParse — edge cases', () => {
  it('returns null for empty input', () => {
    const result = smartParse('', 'single-series');
    expect(result.data).toBeNull();
  });

  it('returns null for garbage text', () => {
    const result = smartParse('this is not data at all', 'single-series');
    expect(result.data).toBeNull();
    expect(result.format).toBe('unknown');
  });

  it('handles CSV with missing values', () => {
    const csv = 'Name,Value\nAlpha,10\nBeta,\nGamma,30';
    const result = smartParse(csv, 'key-value');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(3);
    expect(result.data!.items![1].value).toBe(0); // missing becomes 0
  });

  it('handles single-row CSV', () => {
    const csv = 'Name,Value\nOnly,42';
    const result = smartParse(csv, 'key-value');
    expect(result.data).not.toBeNull();
    expect(result.data!.items).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────
// validateData
// ─────────────────────────────────────────────────────

describe('validateData', () => {
  it('validates valid single-series data', () => {
    const result = validateData(
      { labels: ['A', 'B'], series: [{ name: 'S1', data: [10, 20] }] },
      'single-series',
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('catches missing labels', () => {
    const result = validateData(
      { series: [{ name: 'S1', data: [10, 20] }] },
      'single-series',
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing "labels" array');
  });

  it('catches missing series', () => {
    const result = validateData(
      { labels: ['A', 'B'] },
      'single-series',
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing "series" array');
  });

  it('warns on label/data length mismatch', () => {
    const result = validateData(
      { labels: ['A', 'B', 'C'], series: [{ name: 'S1', data: [10, 20] }] },
      'single-series',
    );
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('validates xy data', () => {
    const valid = validateData({ points: [{ x: 1, y: 2 }] }, 'xy');
    expect(valid.valid).toBe(true);

    const invalid = validateData({}, 'xy');
    expect(invalid.valid).toBe(false);
  });

  it('validates matrix data', () => {
    const valid = validateData(
      { matrix: { rows: ['A'], cols: ['B'], values: [[1]] } },
      'matrix',
    );
    expect(valid.valid).toBe(true);

    const invalid = validateData({}, 'matrix');
    expect(invalid.valid).toBe(false);
  });

  it('validates distribution data', () => {
    const valid = validateData({ raw: [1, 2, 3] }, 'distribution');
    expect(valid.valid).toBe(true);

    const invalid = validateData({}, 'distribution');
    expect(invalid.valid).toBe(false);
  });

  it('validates items-based shapes', () => {
    const shapes: DataShape[] = ['key-value', 'flow', 'gantt', 'error', 'geo', 'venn'];
    for (const shape of shapes) {
      const valid = validateData({ items: [{ label: 'A', value: 1 }] }, shape);
      expect(valid.valid).toBe(true);

      const invalid = validateData({}, shape);
      expect(invalid.valid).toBe(false);
    }
  });
});
