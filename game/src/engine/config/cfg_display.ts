import { ConfigPage } from "./cfg_page";

export class ConfigDisplay implements ConfigPage {
    page = 'display';
    theme: string = 'dark';
    language: string = 'en-US';
    showPerformance: boolean = false;
}