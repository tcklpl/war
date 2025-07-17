import type { ConfigPage } from './cfg-page';

export class ConfigDisplay implements ConfigPage {
	page = 'display';
	theme = 'dark';
	showPerformance = false;
	showPerformanceCharts = false;
}
