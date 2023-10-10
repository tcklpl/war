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
    private _prefilteredSkybox = new Texture();
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
                { binding: 1, resource: this._prefilteredSkybox.texture.createView({ dimension: 'cube' }) }
            ]
        });

        const res = {
            skybox: skyboxBindGroup
        };

        this._pipelineBindGroups.set(pipeline, res);
        return res;
    }

    /**
     * Constructs a skybox texture and pre-filters the produced cubemap from an equirectangular HDR asset.
     * 
     * This function essentially creates the skybox.
     * 
     * @param hdrAsset HDR Asset from the Asset Manager.
     * @param resolution Desired cubemap resolution.
     */
    async setSkyboxFromHDRAsset(hdrAsset: HDRAsset, resolution = 1024) {
        const equirecTex = new Texture(await TextureUtils.createRGBA32fFromRGBEData(hdrAsset.data));
        await this.setSkyboxFromEquirectangularProjection(equirecTex, resolution);
        equirecTex.free();
    }

    /**
     * Generates a `rgba16float` cubemap (sized [resolution, resolution, 6]) from an equirectangular projection texture.
     * @param equirecTex Equirectangular projection texture.
     * @param resolution Final skybox resolution.
     */
    async setSkyboxFromEquirectangularProjection(equirecTex: Texture, resolution = 1024) {
        const cubemapTex = new Texture(
            await game.engine.utilRenderers.equirecToCubemap.renderEquirectangularMapToCubemap(equirecTex.texture, {
                cubemapResolution: resolution,
                mipCount: 10
            })
        );
        await cubemapTex.generateBitmaps();
        await this.prefilterSkybox(cubemapTex);
        // the cubemap can be discarded as we can use the first mip of the pre-filtered one as the skybox
        cubemapTex.free();
    }

    /**
     * Pre-filters the skybox cubemap using the util renderer.
     * @param skybox Cubemap skybox texture with at least 10 mips.
     */
    async prefilterSkybox(skybox: Texture) {
        // the cubemap resolution is going to be the width as we want the first layer to be a copy of the skybox.
        this._prefilteredSkybox.texture = await game.engine.utilRenderers.cubemapPrefilter.prefilterCubemap(skybox.texture, skybox.texture.width);
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
        this._prefilteredSkybox.free();
    }
    
}