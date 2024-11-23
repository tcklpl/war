import { MathUtils } from '../../../utils/math_utils';
import { Quaternion } from '../quaternion/quaternion';
import { Light, LightProperties } from './light';

/*
    Directional light buffer format (0x70 Bytes):

    0   4   8   B   F
00  ░░░ color ░░░▒▒▒▒   [vec3f "color" (12 bytes)] + [f32 "radius" (4 bytes)]
10  ░ direction ░▒▒▒▒   [vec3f "direction" (12 bytes)] + [f32 "intensity" (4 bytes)]
20  ▓ shadow map uv ▓   [vec4f "shadow map UV" (16 bytes)]
30  |               |
40  |     Shadow    |   [mat4x4f "shadow viewproj matrix" (64 bytes)]
50  |ViewProj Matrix|
60  |               |
70
    -: padding
    ░: vec3f
    ▒: f32
    ▓: vec4f
*/
export class DirectionalLight extends Light {
    constructor(
        props: LightProperties,
        public rotation: Quaternion,
        enabled: boolean = true,
    ) {
        super(props, enabled);
    }

    static get byteSize() {
        return MathUtils.ensurePadding(304);
    }

    private getShadowMappingData(): number[] {
        return this.shadowMappingViewProj?.values ?? new Array(0x40).fill(0);
    }

    writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void {
        const offset = index * DirectionalLight.byteSize + generalBufferOffset;

        const shadowMapUV = [
            this.shadowAtlasMappedRegion?.uvLowerCorner.x ?? -1,
            this.shadowAtlasMappedRegion?.uvLowerCorner.y ?? -1,
            this.shadowAtlasMappedRegion?.uvHigherCorner.x ?? -1,
            this.shadowAtlasMappedRegion?.uvHigherCorner.y ?? -1,
        ];
        const data = Float32Array.of(
            ...this.properties.color.values,
            this.properties.radius,
            ...this.rotation.asDirectionVector.multiplyFactor(-1).normalize().values,
            this.properties.intensity,
            ...shadowMapUV,
            ...this.getShadowMappingData(),
        );
        device.queue.writeBuffer(buf, offset, data);
    }
}
