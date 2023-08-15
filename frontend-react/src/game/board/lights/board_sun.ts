import { DirectionalLight } from "../../../engine/data/lights/directional_light";
import { Vec3 } from "../../../engine/data/vec/vec3";

export class BoardSun extends DirectionalLight {

    constructor() {
        const light = game.engine.managers.asset.getGLTFAsset('board').gltfFile.defaultScene.lights[0];
        
        super('Board Sun', light.translation, Vec3.fromArray(light.light.color), light.light.intensity, light.rotation);
        game.engine.managers.light.register(this);
    }
}