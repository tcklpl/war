import { Skybox } from "../../engine/data/skybox/skybox";
import { TextureUtils } from "../../utils/texture_utils";

export class BoardSkybox extends Skybox {

    private _skyImage = game.engine.managers.asset.getHDRAsset('thatch_chapel_4k');

    async initialize() {
        const equirecTex = await TextureUtils.createRGBA32fFromRGBEData(this._skyImage.data);
        this.skybox = await game.engine.utilRenderers.equirecToCubemap.renderEquirectangularMapToCubemap(equirecTex, 'rgba32float', 1024);
        this.convolutedSkybox = await game.engine.utilRenderers.cubemapConvolution.convoluteCubemap(this.skybox, 256);
        this.prefilteredSkybox = await game.engine.utilRenderers.cubemapPrefilter.prefilterCubemap(this.skybox);
        equirecTex.destroy();
    }

}