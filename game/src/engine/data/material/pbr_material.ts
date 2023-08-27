import { PrincipledBSDFShader } from "../../../shaders/principled_bsdf/principled_bsdf_shader";
import { TextureUtils } from "../../../utils/texture_utils";
import { Vec4 } from "../vec/vec4";
import { Material } from "./material";

interface PBRMaterialProps {
    baseColor: Vec4;
    metallic: number;
    roughness: number;
    ior: number;
}

export class PBRMaterial extends Material {

    private _albedo!: GPUTexture;
    private _normal!: GPUTexture;
    private _metallic!: GPUTexture;
    private _roughness!: GPUTexture;
    private _ao!: GPUTexture;

    private _sampler!: GPUSampler;

    private _pipelineBindGroups = new Map<GPURenderPipeline, GPUBindGroup>();

    constructor(name: string, private _props: PBRMaterialProps) {
        super(name);
        this.constructTextures();
    }

    private constructTextures() {
        if (this._albedo) this._albedo.destroy();
        this._albedo = TextureUtils.createTextureFromNormalizedVec4(this._props.baseColor);

        if (this._normal) this._normal.destroy();
        this._normal = TextureUtils.createTextureFromNormalizedVec4(new Vec4(0.5, 0.5, 1.0, 1.0));

        if (this._metallic) this._metallic.destroy();
        this._metallic = TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(this._props.metallic));

        if (this._roughness) this._roughness.destroy();
        this._roughness = TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(this._props.roughness));

        if (this._ao) this._ao.destroy();
        this._ao = TextureUtils.createTextureFromNormalizedVec4(Vec4.fromValue(1));

        this._sampler = device.createSampler({
            label: `PBR Material '${this.name} sampler'`
        });

    }

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const newBindGroup = device.createBindGroup({
            label: `PBR Material '${this.name}' bind group`,
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_MATERIAL),
            entries: [
                { binding: 0, resource: this._sampler },
                { binding: 1, resource: this._albedo.createView() },
                { binding: 2, resource: this._normal.createView() },
                { binding: 3, resource: this._metallic.createView() },
                { binding: 4, resource: this._roughness.createView() },
                { binding: 5, resource: this._ao.createView() },
            ]
        });
        this._pipelineBindGroups.set(pipeline, newBindGroup);
        return newBindGroup;
    }

    free() {
        this._albedo?.destroy();
        this._normal?.destroy();
        this._metallic?.destroy();
        this._roughness?.destroy();
        this._ao?.destroy();
    }

}
