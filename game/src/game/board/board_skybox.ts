import { Skybox } from "../../engine/data/skybox/skybox";
import { TextureUtils } from "../../utils/texture_utils";

export class BoardSkybox extends Skybox {

    private _skyImage = game.engine.managers.asset.getHDRAsset('thatch_chapel');

    async initialize() {
        const bitmap = await this._skyImage.toBitmap();
        const equirecTex = await TextureUtils.createRGBA16fFromHDRBitmap(bitmap, bitmap.width, bitmap.height);
        this.skybox = await game.engine.utilRenderers.equirecToCubemap.renderEquirectangularMapToCubemap(equirecTex, 1024);
        this.convolutedSkybox = await game.engine.utilRenderers.cubemapConvolution.convoluteCubemap(this.skybox, 256);
        this.prefilteredSkybox = await game.engine.utilRenderers.cubemapPrefilter.prefilterCubemap(this.skybox);
        equirecTex.destroy();
    }

}