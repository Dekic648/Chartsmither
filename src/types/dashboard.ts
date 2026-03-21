import type { ChartTypeId, ChartData, ChartOptions } from './chart';

export interface DashboardPanel {
  id: string;
  chartType: ChartTypeId;
  data: ChartData;
  options: ChartOptions;
  size: 'small' | 'medium' | 'large'; // 4, 6, or 12 columns
}

export interface DashboardConfig {
  title: string;
  panels: DashboardPanel[];
}
