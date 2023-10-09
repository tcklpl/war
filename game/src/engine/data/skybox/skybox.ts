import { SkyboxShader } from "../../../shaders/geometry/skybox/skybox_shader";
import { TextureUtils } from "../../../utils/texture_utils";
import { HDRAsset } from "../../asset/hdr_asset";
import { Texture } from "../texture/texture";

export abstract class Skybox {

    private _sampler = device.createSampler({
        label: 'Skybox sampler',
        minFilter: 'linear',
        magFilter: 'linear',
        mipmapFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        addressModeW: 'clamp-to-edge'
    });
    private _skybox = new Texture();
    private _prefilteredSkybox = new Texture();
    private _prefilteredSkyboxMip0Resolution = 1024;

    private _pipelineBindGroups = new Map<GPURenderPipeline, {skybox: GPUBindGroup}>();

    abstract initialize(): Promise<void>;

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const skyboxBindGroup = device.createBindGroup({
            label: `Skybox bind group`,
            layout: pipeline.getBindGroupLayout(SkyboxShader.BINDING_GROUPS.TEXTURE),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: this._skybox.texture.createView({ dimension: 'cube' }) }
            ]
        });

        const res = {
            skybox: skyboxBindGroup
        };

        this._pipelineBindGroups.set(pipeline, res);
        return res;
    }

    async setSkyboxFromHDRAsset(hdrAsset: HDRAsset, resolution = 1024) {
        const equirecTex = new Texture(await TextureUtils.createRGBA32fFromRGBEData(hdrAsset.data));
        await this.setSkyboxFromEquirectangularProjection(equirecTex, 'rgba32float', resolution);
        equirecTex.free();
    }

    async setSkyboxFromEquirectangularProjection(equirecTex: Texture, texType: 'rgba16float' | 'rgba32float', resolution = 1024) {
        const cubemapTex = new Texture(
            await game.engine.utilRenderers.equirecToCubemap.renderEquirectangularMapToCubemap(equirecTex.texture, {
                texType: texType,
                cubemapResolution: resolution,
                mipCount: 10
            })
        );
        await cubemapTex.generateBitmaps();
        await this.setSkyboxCubemap(cubemapTex);
    }

    async setSkyboxCubemap(skyboxCubemap: Texture) {
        this.skybox = skyboxCubemap;
        await this.prefilterSkybox();
    }

    async prefilterSkybox() {
        this._prefilteredSkybox.texture = await game.engine.utilRenderers.cubemapPrefilter.prefilterCubemap(this._skybox.texture, this._prefilteredSkyboxMip0Resolution);
    }

    private set skybox(skybox: Texture) {
        this._skybox.free();
        this._skybox = skybox;
    }

    get skybox() {
        return this._skybox;
    }

    get prefilteredSkybox() {
        return this._prefilteredSkybox;
    }

    get sampler() {
        return this._sampler;
    }

    protected set sampler(s: GPUSampler) {
        this._sampler = s;
    }

    free() {
        this._skybox.free();
        this._prefilteredSkybox.free();
    }
    
}