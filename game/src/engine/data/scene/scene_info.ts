import { BufferUtils } from "../../../utils/buffer_utils";
import { DirectionalLight } from "../lights/directional_light";
import { Light } from "../lights/light";
import { Skybox } from "../skybox/skybox";
import { SceneInfoBindGroupOptions } from "./scene_info_bind_group_options";

export class SceneInfo {

    private _lights: Light[];
    private _skybox: Skybox;

    private _directionalLightBuffer = BufferUtils.createEmptyBuffer(DirectionalLight.byteSize * 2 + 16, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    private _pipelineBindGroups = new Map<GPURenderPipeline, {bg: GPUBindGroup, opt: SceneInfoBindGroupOptions}>();

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

    private createBindGroup(pipeline: GPURenderPipeline, opt: SceneInfoBindGroupOptions) {
        /*
            Binding Description
            0       Directional light buffer
            1       IBL irradiance sampler
            2       IBL irradiance cubemap
            3       IBL prefiltered map
            4       IBL LUT
        */
        return device.createBindGroup({
            label: `Scene info bind group`,
            layout: pipeline.getBindGroupLayout(opt.layoutIndex),
            entries: [
                ...(opt.directionalLights.use ?     [{ binding: opt.directionalLights.index, resource: { buffer: this._directionalLightBuffer } }] : []),
                ...(opt.skybox.use ?                [{ binding: opt.skybox.index, resource: this._skybox.skybox.createView({ dimension: 'cube' }) }] : []),
                ...(opt.convolutedSkybox.use ?      [{ binding: opt.convolutedSkybox.index, resource: this._skybox.convolutedSkybox.createView({ dimension: 'cube' }) }] : []),
                ...(opt.prefilteredSkybox.use ?     [{ binding: opt.prefilteredSkybox.index, resource: this._skybox.prefilteredSkybox.createView({ dimension: 'cube' }) }] : []),
                ...(opt.brdfLUT.use ?               [{ binding: opt.brdfLUT.index, resource: game.engine.brdfLUT.createView()}] : []),
                ...opt.extras
            ]
        });
    }

    getBindGroup(pipeline: GPURenderPipeline, opt: SceneInfoBindGroupOptions) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result.bg;
        const newBindGroup = this.createBindGroup(pipeline, opt);
        this._pipelineBindGroups.set(pipeline, { bg: newBindGroup, opt: opt });
        return newBindGroup;
    }

    /**
     * To be used when changing skyboxes, as we'll need to to build a new bind group to use a new
     * texture view from the new skybox.
     */
    updateBindGroups() {
        this._pipelineBindGroups.forEach((v, k) => {
            this._pipelineBindGroups.set(k, {bg: this.createBindGroup(k, v.opt), opt: v.opt});
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