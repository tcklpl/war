import { BufferUtils } from "../../../utils/buffer_utils";
import { DirectionalLight } from "../lights/directional_light";
import { Light } from "../lights/light";
import { Skybox } from "../skybox/skybox";

export class SceneInfo {

    private _lights: Light[];
    private _skybox: Skybox;

    private _directionalLightBuffer = BufferUtils.createEmptyBuffer(DirectionalLight.byteSize * 2 + 16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _pipelineBindGroups = new Map<GPURenderPipeline, {bg: GPUBindGroup, index: number}>();

    constructor(lights: Light[], skybox: Skybox) {
        this._lights = lights;
        this._skybox = skybox;
        this.updateLightBuffers();
    }

    updateLightBuffers() {
        this.updateDirectionalLightBuffer();
    }

    private updateDirectionalLightBuffer() {
        const directionalLights = this._lights.filter(x => x instanceof DirectionalLight);
        device.queue.writeBuffer(this._directionalLightBuffer, 0, new Uint32Array([directionalLights.length]));
        directionalLights.forEach((l, i) => l.writeToBuffer(this._directionalLightBuffer, i, 16));
    }

    private createBindGroup(pipeline: GPURenderPipeline, index: number) {
        /*
            Binding Description
            0       Directional light buffer
            1       IBL irradiance sampler
            2       IBL irradiance cubemap
        */
        return device.createBindGroup({
            label: `Scene info bind group`,
            layout: pipeline.getBindGroupLayout(index),
            entries: [
                { binding: 0, resource: { buffer: this._directionalLightBuffer } },
                { binding: 1, resource: this._skybox.sampler },
                { binding: 2, resource: this._skybox.convolutedSkybox.createView({ dimension: 'cube' }) }
            ]
        });
    }

    getBindGroup(pipeline: GPURenderPipeline, index: number) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result.bg;
        const newBindGroup = this.createBindGroup(pipeline, index);
        this._pipelineBindGroups.set(pipeline, { bg: newBindGroup, index: index });
        return newBindGroup;
    }

    /**
     * To be used when changing skyboxes, as we'll need to to build a new bind group to use a new
     * texture view from the new skybox.
     */
    updateBindGroups() {
        this._pipelineBindGroups.forEach((v, k) => {
            this._pipelineBindGroups.set(k, {bg: this.createBindGroup(k, v.index), index: v.index});
        });
    }

    free() {
        this._directionalLightBuffer?.destroy();
    }

    get lights() {
        return this._lights;
    }

    get skybox() {
        return this._skybox;
    }

    set skybox(s: Skybox) {
        this._skybox = s;
        this.updateBindGroups();
    }


}