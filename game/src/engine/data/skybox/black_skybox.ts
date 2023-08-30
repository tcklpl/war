import { TextureUtils } from "../../../utils/texture_utils";
import { Skybox } from "./skybox";

export class BlackSkybox extends Skybox {

    async initialize() {
        this.skybox = TextureUtils.createBlackSkybox();
        this.convolutedSkybox = this.skybox;
        this.prefilteredSkybox = this.skybox;
    }
    
}