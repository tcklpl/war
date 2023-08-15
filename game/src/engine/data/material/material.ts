import { PBRShader } from "../../../shaders/pbr/pbr_shader";

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

    abstract get bindBroup(): GPUBindGroup;

    bind(passEncoder: GPURenderPassEncoder) {
        passEncoder.setBindGroup(PBRShader.UNIFORM_BINDING_GROUPS.FRAGMENT_MATERIAL, this.bindBroup);
    }

    abstract free(): void;
}