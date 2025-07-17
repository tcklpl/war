import { Skybox } from ':engine/data/skybox/skybox';

export class BoardSkybox extends Skybox {
	private readonly _skyImage = game.engine.managers.asset.getHDRAsset('thatch_chapel_4k');

	async initialize() {
		await this.setSkyboxFromHDRAsset(this._skyImage);
	}
}
