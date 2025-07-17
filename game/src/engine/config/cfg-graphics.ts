import type { ConfigPage } from './cfg-page';

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
	shadowMapQuality = 3;

	/**
	 * Shadow filtering technique:
	 *
	 * | Index | Meaning | Techniques
	 * |:------|:--------|:-----------
	 * | 0     | Off     | --
	 * | 1     | Low     | PCF with Poisson Disk
	 * | 2     | Medium  | VSM + PCF
	 */
	shadowFiltering = 2;

	/**
	 * Shader quality
	 * 1    Low
	 * 2    Normal
	 */
	shaderQuality = 2;

	// post processing
	useSSAO = true;
	useBloom = true;
	useTAA = true;
	motionBlurAmount = 1.0;
	useFilmGrain = true;
}
