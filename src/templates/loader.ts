import type { ChartData, ChartOptions } from '../types/chart';
import { CHART_TEMPLATES } from './index';

/**
 * Load a template's data and options by ID.
 * Returns null if the template is not found.
 * Data is deep-copied so the caller can mutate freely.
 */
export function loadTemplate(
  templateId: string,
): { data: ChartData; options: Partial<ChartOptions> } | null {
  const template = CHART_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  return {
    data: JSON.parse(JSON.stringify(template.data)),
    options: JSON.parse(JSON.stringify(template.options)),
  };
}
