import { TextureUtils } from "../../../utils/texture_utils";
import { Texture } from "../texture/texture";
import { Skybox } from "./skybox";

export class BlackSkybox extends Skybox {

    async initialize() {
        const blackSkyboxTexture = new Texture(TextureUtils.createBlackSkybox());
        await this.prefilterSkybox(blackSkyboxTexture);
        blackSkyboxTexture.free();
    }
    
}