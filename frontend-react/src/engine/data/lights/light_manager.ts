import { PBRShader } from "../../../shaders/pbr/pbr_shader";
import { BufferUtils } from "../../../utils/buffer_utils";
import { Manager } from "../../manager";
import { DirectionalLight } from "./directional_light";
import { Light } from "./light";

export class LightManager extends Manager<Light> {

    private _directionalLightsBuffer!: GPUBuffer;

    private _bindGroup!: GPUBindGroup;
    

    constructBuffers() {
        this._directionalLightsBuffer = BufferUtils.createEmptyBuffer(DirectionalLight.byteSize * 2 + 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        this._bindGroup = device.createBindGroup({
            label: 'PBR Lights',
            layout: game.engine.renderer.pbrPipeline.getBindGroupLayout(PBRShader.UNIFORM_BINDING_GROUPS.FRAGMENT_LIGHTS),
            entries: [
                { binding: 0, resource: { buffer: this._directionalLightsBuffer } }
            ]
        });
    }

    writeBuffer() {

        const activeLights = this.all.filter(l => l.enabled);

        const directionalLights = activeLights.filter(l => l instanceof DirectionalLight);
        device.queue.writeBuffer(this._directionalLightsBuffer, 0, new Uint32Array([directionalLights.length]));
        directionalLights.forEach((l, i) => l.writeToBuffer(this._directionalLightsBuffer, i, 16));
    }

    bindLights(passEncoder: GPURenderPassEncoder) {
        passEncoder.setBindGroup(PBRShader.UNIFORM_BINDING_GROUPS.FRAGMENT_LIGHTS, this._bindGroup);
    }

    freeLights() {
        this._directionalLightsBuffer?.destroy();
    }
}