import { Skybox } from "../../engine/data/skybox/skybox";
import { TextureUtils } from "../../utils/texture_utils";

export class BoardSkybox extends Skybox {

    private _skyImage = game.engine.managers.asset.getHDRAsset('kloofendal_43d_clear');

    async initialize() {
        const bitmap = await this._skyImage.toBitmap();
        const equirecTex = await TextureUtils.createRGBA16fFromHDRBitmap(bitmap, this._skyImage.width, this._skyImage.height);
        this.skybox = await game.engine.utilRenderers.equirecToCubemap.renderEquirectangularMapToCubemap(equirecTex, 1024);
        this.convolutedSkybox = await game.engine.utilRenderers.cubemapConvolution.convoluteCubemap(this.skybox, 128);
        equirecTex.destroy();
    }

}