import { ConfigPage } from "./cfg_page";

export class ConfigGame implements ConfigPage {
    page = 'game';
    cacheAssets: boolean = true;
}