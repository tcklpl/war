import { ConfigPage } from './cfg_page';

export class ConfigDisplay implements ConfigPage {
    page = 'display';
    theme: string = 'dark';
    showPerformance: boolean = false;
    showPerformanceCharts: boolean = false;
}
