import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../mat/mat4";
import { Quaternion } from "../quaternion/quaternion";
import { Vec3 } from "../vec/vec3";
import { Vec4 } from "../vec/vec4";
import { Light, LightProperties } from "./light";

export class DirectionalLight extends Light {

    constructor(props: LightProperties, public rotation: Quaternion, enabled: boolean = true) {
        super(props, enabled);
    }

    static get byteSize() {
        return MathUtils.ensurePadding(2 * Vec3.byteSize + 4 + Vec4.byteSize + Mat4.byteSize);
    }

    writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void {
        const offset = index * DirectionalLight.byteSize + generalBufferOffset;

        /*
            Directional light buffer format:

            0   4   8   B   F
            ░░░ color ░░░----   [vec3f "color" (12 bytes)] + [padding (4 bytes)]
            ░ direction ░▒▒▒▒   [vec3f "direction" (12 bytes)] + [f32 "intensity" (4 bytes)]
            ▓ shadow map uv ▓   [vec4f "shadow map UV" (16 bytes)]
            |               |
            |     Shadow    |   [mat4x4f "shadow viewproj matrix" (64 bytes)]
            |ViewProj Matrix|
            |               |

            -: padding
            ░: vec3f
            ▒: f32
            ▓: vec4f
        */
        device.queue.writeBuffer(buf, offset, this.properties.color.asF32Array);
        device.queue.writeBuffer(buf, offset + Vec3.byteSize + 4, this.rotation.asDirectionVector.multiplyFactor(-1).normalize().asF32Array);
        device.queue.writeBuffer(buf, offset + Vec3.byteSize * 2 + 4, new Float32Array([this.properties.intensity]));
        const shadowMapUV = [
            this.shadowAtlasMappedRegion?.uvLowerCorner.x ?? -1,
            this.shadowAtlasMappedRegion?.uvLowerCorner.y ?? -1,
            this.shadowAtlasMappedRegion?.uvHigherCorner.x ?? -1,
            this.shadowAtlasMappedRegion?.uvHigherCorner.y ?? -1
        ];
        device.queue.writeBuffer(buf, offset + 0x20, new Float32Array(shadowMapUV));
        if (this.shadowMappingViewProj) {
            device.queue.writeBuffer(buf, offset + 0x30, this.shadowMappingViewProj.asF32Array);
        }
    }

}