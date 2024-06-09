import { MathUtils } from '../../../utils/math_utils';
import { Vec3 } from '../vec/vec3';
import { Light, LightProperties } from './light';

export class PointLight extends Light {
    constructor(props: LightProperties, enabled: boolean = true) {
        super(props, enabled);
    }

    static get byteSize() {
        return MathUtils.ensurePadding(Vec3.byteSize + 4 + Vec3.byteSize);
    }

    writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void {
        const offset = index * PointLight.byteSize + generalBufferOffset;

        /*
            Directional light buffer format:

            0   4   8   B   F
            ░░░ color ░░░▒▒▒▒   [vec3f "color" (12 bytes)] + [f32 "intensity" (4 bytes)]
            ░  position ░----

            -: padding
            ░: vec3f
            ▒: f32
        */
        const bufferContent = new Float32Array([
            ...this.properties.color.asF32Array,
            this.properties.intensity,
            ...this.properties.position.asF32Array,
        ]);
        device.queue.writeBuffer(buf, offset, bufferContent);
    }
}
