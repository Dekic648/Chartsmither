import type { ChartData, ChartOptions, ChartTypeId, SavedChart, Report } from '../types/chart';

const PREFIX = 'chartcraft:';

// ── Editor auto-save (per chart type, for "resume editing") ─────────

export function saveChart(typeId: string, data: ChartData, options: ChartOptions): void {
  try {
    const payload = JSON.stringify({ data, options, savedAt: Date.now() });
    localStorage.setItem(`${PREFIX}${typeId}`, payload);
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

export function loadChart(typeId: string): { data: ChartData; options: ChartOptions } | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}${typeId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data && parsed.options) {
      return { data: parsed.data, options: parsed.options };
    }
    return null;
  } catch {
    return null;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function autoSave(typeId: string, data: ChartData, options: ChartOptions): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    saveChart(typeId, data, options);
  }, 500);
}

// ── Chart Gallery (unique saved charts for reports) ─────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const GALLERY_PREFIX = `${PREFIX}saved:`;

export function saveToGallery(typeId: ChartTypeId, data: ChartData, options: ChartOptions): SavedChart {
  const id = generateId();
  const chart: SavedChart = {
    id,
    typeId,
    title: options.title || typeId,
    data,
    options,
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(`${GALLERY_PREFIX}${id}`, JSON.stringify(chart));
  } catch { /* storage full */ }
  return chart;
}

export function loadGalleryChart(id: string): SavedChart | null {
  try {
    const raw = localStorage.getItem(`${GALLERY_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as SavedChart;
  } catch {
    return null;
  }
}

export function listGalleryCharts(): SavedChart[] {
  const charts: SavedChart[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(GALLERY_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          charts.push(JSON.parse(raw) as SavedChart);
        }
      }
    }
  } catch { /* ignore */ }
  return charts.sort((a, b) => b.savedAt - a.savedAt);
}

export function deleteGalleryChart(id: string): void {
  try {
    localStorage.removeItem(`${GALLERY_PREFIX}${id}`);
  } catch { /* ignore */ }
}

// Migrate existing auto-saved charts into gallery (run once)
export function migrateToGallery(): void {
  try {
    if (localStorage.getItem(`${PREFIX}gallery_migrated`)) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX) && !key.startsWith(GALLERY_PREFIX) && !key.includes('report') && !key.includes('gallery_migrated')) {
        const typeId = key.replace(PREFIX, '');
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.data && parsed?.options) {
            saveToGallery(typeId as ChartTypeId, parsed.data, parsed.options);
          }
        }
      }
    }
    localStorage.setItem(`${PREFIX}gallery_migrated`, '1');
  } catch { /* ignore */ }
}

// ── Reports ─────────────────────────────────────────────────────────

const REPORT_INDEX_KEY = `${PREFIX}reports`;
const REPORT_PREFIX = `${PREFIX}report:`;

interface ReportSummary {
  id: string;
  clientName: string;
  title: string;
  updatedAt: number;
  pageCount: number;
}

function loadReportIndex(): ReportSummary[] {
  try {
    const raw = localStorage.getItem(REPORT_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReportIndex(index: ReportSummary[]): void {
  try {
    localStorage.setItem(REPORT_INDEX_KEY, JSON.stringify(index));
  } catch { /* ignore */ }
}

export function createReport(): Report {
  const id = generateId();
  const now = Date.now();
  const report: Report = {
    id,
    clientName: '',
    firmName: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    preparedBy: '',
    confidentiality: 'confidential',
    brandTheme: 'economist',
    pages: [],
    createdAt: now,
    updatedAt: now,
  };
  saveReport(report);
  return report;
}

export function saveReport(report: Report): void {
  try {
    report.updatedAt = Date.now();
    localStorage.setItem(`${REPORT_PREFIX}${report.id}`, JSON.stringify(report));
    // Update index
    const index = loadReportIndex();
    const existing = index.findIndex((r) => r.id === report.id);
    const summary: ReportSummary = {
      id: report.id,
      clientName: report.clientName,
      title: report.title,
      updatedAt: report.updatedAt,
      pageCount: report.pages.length,
    };
    if (existing >= 0) {
      index[existing] = summary;
    } else {
      index.unshift(summary);
    }
    saveReportIndex(index);
  } catch { /* ignore */ }
}

export function loadReport(id: string): Report | null {
  try {
    const raw = localStorage.getItem(`${REPORT_PREFIX}${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function listReports(): ReportSummary[] {
  return loadReportIndex().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function deleteReport(id: string): void {
  try {
    localStorage.removeItem(`${REPORT_PREFIX}${id}`);
    const index = loadReportIndex().filter((r) => r.id !== id);
    saveReportIndex(index);
  } catch { /* ignore */ }
}
