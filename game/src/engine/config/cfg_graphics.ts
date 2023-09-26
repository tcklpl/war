import { ConfigPage } from "./cfg_page";

export class ConfigGraphics implements ConfigPage {
    page = 'graphics';
    useSSAO: boolean = true;
    useBloom: boolean = true;
    useTAA: boolean = true;
    motionBlurAmount: number = 1.0;
}