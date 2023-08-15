import { MathUtils } from "../../../utils/math_utils";
import { Quaternion } from "../quaternion/quaternion";
import { Vec3 } from "../vec/vec3";
import { Light } from "./light";

export class DirectionalLight extends Light {

    constructor(name: string, position: Vec3, color: Vec3, intensity: number, private rotation: Quaternion, enabled: boolean = true) {
        super(name, position, color, intensity, -1, enabled);
    }

    static get byteSize() {
        return MathUtils.ensurePadding(2 * Vec3.byteSize + 4);
    }

    writeToBuffer(buf: GPUBuffer, index: number, generalBufferOffset: number): void {
        const offset = index * DirectionalLight.byteSize + generalBufferOffset;

        /*
            Directional light buffer format:
            (vec3f) [12 bytes] -> color
            (vec3f) [12 bytes] [+4 padding] -> direction
            (float) [ 4 bytes] -> intensity
        */
        device.queue.writeBuffer(buf, offset, this.color.asF32Array);
        device.queue.writeBuffer(buf, offset + Vec3.byteSize + 4, this.rotation.asDirectionVector.multiplyByFactor(-1).normalize().asF32Array);
        device.queue.writeBuffer(buf, offset + Vec3.byteSize * 2 + 4, new Float32Array([this.intensity]));
    }

}