import { ConfigPage } from "./cfg_page";

export class ConfigGraphics implements ConfigPage {
    page = 'graphics';

    // rendering
    /**
     * Shadow map quality, possible values:
     * 0    Off         --
     * 1    Very Low    512
     * 2    Low         1024
     * 3    Medium      2048
     * 4    High        4096
     */
    shadowMapQuality: number = 3;

    // post processing
    useSSAO: boolean = true;
    useBloom: boolean = true;
    useTAA: boolean = true;
    motionBlurAmount: number = 1.0;
    useFilmGrain: boolean = true;
}