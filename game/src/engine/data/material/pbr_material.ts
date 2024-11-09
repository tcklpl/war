import { PrincipledBSDFShader } from '../../../shaders/geometry/principled_bsdf/principled_bsdf_shader';
import { TextureUtils } from '../../../utils/texture_utils';
import { Texture } from '../texture/texture';
import { Vec4 } from '../vec/vec4';
import { Material } from './material';

interface PBRMaterialProps {
    baseColor: Vec4;
    metallic: number;
    roughness: number;
    ior: number;
}

export class PBRMaterial extends Material {
    /*
        PBR Material Information:

        Texture Name    Format          Separation          Data Explanation
        -------------------------------------------------------------------------------
        Albedo          rgba16float     [r, g, b, a]¹       1: Material HDR color.

        Normal          rgba8unorm      [r, g, b]¹ [a]²     1: Normal vector;
                                                            2: AO.

        Props 1         rgba8unorm      [r]¹ [g]² [b]³ [a]⁴ 1: Metallic;
                                                            2: Roughness;
                                                            3: Transmission;
                                                            4: Transmission Roughness;

        Props 2         r16float        [r]¹                1: IOR

    */
    private readonly _albedo = new Texture();
    private _normal_ao = new Texture();
    private _props1 = new Texture();
    private _props2 = new Texture();

    private _sampler!: GPUSampler;

    private readonly _pipelineBindGroups = new Map<GPURenderPipeline, GPUBindGroup>();

    constructor(
        name: string,
        private readonly _props: PBRMaterialProps,
    ) {
        super(name);
        this.constructTextures();
    }

    private async constructTextures() {
        this.free();

        // TODO: Support texture maps
        this._albedo.texture = TextureUtils.createTextureFromNormalizedVec4(this._props.baseColor);

        // TODO: Support normal and AO maps
        const normal = new Texture(TextureUtils.createTextureFromNormalizedVec4(new Vec4(0.5, 0.5, 1.0, 1.0)));
        const ao = new Texture(TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(1)));
        this._normal_ao = await game.engine.utilRenderers.packing.pack_1rgb1a_rgba8unorm(normal, ao);
        [normal, ao].forEach(t => t.free());

        const metallic = new Texture(
            TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(this._props.metallic)),
        );
        const roughness = new Texture(
            TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(this._props.roughness)),
        );
        const transmission = new Texture(TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(0)));
        const transmissionRoughness = new Texture(TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(0)));
        this._props1 = await game.engine.utilRenderers.packing.pack_4r_rgba8unorm(
            metallic,
            roughness,
            transmission,
            transmissionRoughness,
        );
        [metallic, roughness, transmission, transmissionRoughness].forEach(t => t.free());

        this._props2 = new Texture(TextureUtils.create1pxR16Texture(this._props.ior));

        this._sampler = device.createSampler({
            label: `PBR Material '${this.name} sampler'`,
        });
    }

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const newBindGroup = device.createBindGroup({
            label: `PBR Material '${this.name}' bind group`,
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.BINDING_GROUPS.MATERIAL),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: this._albedo.view },
                { binding: 2, resource: this._normal_ao.view },
                { binding: 3, resource: this._props1.view },
                { binding: 4, resource: this._props2.view },
            ],
        });
        this._pipelineBindGroups.set(pipeline, newBindGroup);
        return newBindGroup;
    }

    free() {
        this._albedo.free();
        this._normal_ao.free();
        this._props1.free();
        this._props2.free();
    }
}
