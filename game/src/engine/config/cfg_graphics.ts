import { ConfigPage } from './cfg_page';

export class ConfigGraphics implements ConfigPage {
    page = 'graphics';

    // rendering
    /**
     * Shadow map quality, possible values:
     *
     * | Index | Meaning  | Value |
     * |:------|:---------|:------|
     * | 0     | Off      | --    |
     * | 1     | Very Low | 512   |
     * | 2     | Low      | 1024  |
     * | 3     | Medium   | 2048  |
     * | 4     | High     | 4096  |
     */
    shadowMapQuality: number = 3;

    /**
     * Shadow filtering technique:
     *
     * | Index | Meaning | Techniques
     * |:------|:--------|:-----------
     * | 0     | Off     | --
     * | 1     | Low     | PCF with Poisson Disk
     * | 2     | Medium  | VSM + PCF
     */
    shadowFiltering: number = 2;

    /**
     * Shader quality
     * 1    Low
     * 2    Normal
     */
    shaderQuality: number = 2;

    // post processing
    useSSAO: boolean = true;
    useBloom: boolean = true;
    useTAA: boolean = true;
    motionBlurAmount: number = 1.0;
    useFilmGrain: boolean = true;
}
