import { SkyboxShader } from "../../../shaders/geometry/skybox/skybox_shader";

export abstract class Skybox {

    private _sampler = device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
        mipmapFilter: 'linear'
    });
    private _skybox!: GPUTexture;
    private _convoluted_skybox!: GPUTexture;
    private _prefiltered_skybox!: GPUTexture;

    private _pipelineBindGroups = new Map<GPURenderPipeline, {skybox: GPUBindGroup, convolutedSkybox: GPUBindGroup}>();

    abstract initialize(): Promise<void>;

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const skyboxBindGroup = device.createBindGroup({
            label: `Skybox bind group`,
            layout: pipeline.getBindGroupLayout(SkyboxShader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: this._skybox.createView({ dimension: 'cube' }) }
            ]
        });

        const convolutedSkyboxBindGroup = device.createBindGroup({
            label: `Skybox bind group`,
            layout: pipeline.getBindGroupLayout(SkyboxShader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: this._convoluted_skybox.createView({ dimension: 'cube' }) }
            ]
        });

        const res = {
            skybox: skyboxBindGroup,
            convolutedSkybox: convolutedSkyboxBindGroup
        };

        this._pipelineBindGroups.set(pipeline, res);
        return res;
    }

    get skybox() {
        return this._skybox;
    }

    protected set skybox(tex: GPUTexture) {
        this._skybox = tex;
    }

    get convolutedSkybox() {
        return this._convoluted_skybox;
    }

    protected set convolutedSkybox(tex: GPUTexture) {
        this._convoluted_skybox = tex;
    }

    get prefilteredSkybox() {
        return this._prefiltered_skybox;
    }

    protected set prefilteredSkybox(t: GPUTexture) {
        this._prefiltered_skybox = t;
    }

    get sampler() {
        return this._sampler;
    }

    protected set sampler(s: GPUSampler) {
        this._sampler = s;
    }
    
}