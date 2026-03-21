import type { ChartData, ChartOptions } from '../types/chart';

const PREFIX = 'chartcraft:';

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
