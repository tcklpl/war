import { MappedRegionSize } from "../../../engine/data/atlas/mapped_region_size";
import { DirectionalLight } from "../../../engine/data/lights/directional_light";
import { Vec3 } from "../../../engine/data/vec/vec3";

export class BoardSun extends DirectionalLight {

    constructor() {
        const light = game.engine.managers.asset.getGLTFAsset('board').gltfFile.defaultScene.lights[0];
        super({
            name: 'Board Sun',
            color: Vec3.fromArray(light.light.color),
            intensity: light.light.intensity,
            position: light.translation,
            range: -1,

            castsShadows: true,
            shadowMapSize: MappedRegionSize.BIG,
            shadowMapCanShrink: false
        }, light.rotation, true);
    }
}