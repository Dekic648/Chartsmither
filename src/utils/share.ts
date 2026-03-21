import type { ChartData, ChartOptions } from '../types/chart';

/**
 * Encode chart config into a URL-safe compressed string.
 * Uses base64-encoded JSON. For production, consider using lz-string for compression.
 */
export function encodeChartConfig(
  typeId: string,
  data: ChartData,
  options: ChartOptions,
): string {
  const payload = JSON.stringify({ t: typeId, d: data, o: options });
  return btoa(encodeURIComponent(payload));
}

/**
 * Decode a shared chart config from URL parameter.
 */
export function decodeChartConfig(
  encoded: string,
): { typeId: string; data: ChartData; options: ChartOptions } | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);
    return {
      typeId: parsed.t,
      data: parsed.d,
      options: parsed.o,
    };
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for the current chart.
 */
export function getShareUrl(
  typeId: string,
  data: ChartData,
  options: ChartOptions,
): string {
  const encoded = encodeChartConfig(typeId, data, options);
  const base = window.location.origin;
  return `${base}/edit/${typeId}?chart=${encoded}`;
}

/**
 * Generate an iframe embed snippet.
 */
export function getEmbedCode(
  typeId: string,
  data: ChartData,
  options: ChartOptions,
): string {
  const url = getShareUrl(typeId, data, options);
  return `<iframe src="${url}&embed=true" width="${options.width || 620}" height="${options.height || 400}" frameborder="0" style="border:none;max-width:100%"></iframe>`;
}

/**
 * Copy text to clipboard, return success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
