import { PrincipledBSDFShader } from "../../../shaders/principled_bsdf/principled_bsdf_shader";

export abstract class Material {

    private _id: number;
    
    constructor(private _name: string) {
        this._id = game.engine.managers.material.requestMaterialId();
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    abstract getBindGroup(pipeline: GPURenderPipeline): GPUBindGroup;

    bind(passEncoder: GPURenderPassEncoder, currentPipeline: GPURenderPipeline) {
        passEncoder.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.FRAGMENT_MATERIAL, this.getBindGroup(currentPipeline));
    }

    abstract free(): void;
}