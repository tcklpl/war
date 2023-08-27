import { PrincipledBSDFShader } from "../../../shaders/principled_bsdf/principled_bsdf_shader";
import { BufferUtils } from "../../../utils/buffer_utils";
import { Manager } from "../../manager";
import { DirectionalLight } from "./directional_light";
import { Light } from "./light";

export class LightManager extends Manager<Light> {

    private _directionalLightsBuffer!: GPUBuffer;
    private _pipelineBindGroups = new Map<GPURenderPipeline, GPUBindGroup>();
    
    
    constructBuffers() {
        this._directionalLightsBuffer = BufferUtils.createEmptyBuffer(DirectionalLight.byteSize * 2 + 4, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    }

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const newBindGroup = device.createBindGroup({
            label: `PBR Lights`,
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_LIGHTS),
            entries: [
                { binding: 0, resource: { buffer: this._directionalLightsBuffer } }
            ]
        });
        this._pipelineBindGroups.set(pipeline, newBindGroup);
        return newBindGroup;
    }

    writeBuffer() {

        const activeLights = this.all.filter(l => l.enabled);

        const directionalLights = activeLights.filter(l => l instanceof DirectionalLight);
        device.queue.writeBuffer(this._directionalLightsBuffer, 0, new Uint32Array([directionalLights.length]));
        directionalLights.forEach((l, i) => l.writeToBuffer(this._directionalLightsBuffer, i, 16));
    }

    bindLights(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline) {
        passEncoder.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_LIGHTS, this.getBindGroup(pipeline));
    }

    freeLights() {
        this._directionalLightsBuffer?.destroy();
    }
}