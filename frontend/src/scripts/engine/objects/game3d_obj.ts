import { I3DObject } from "../data_formats/3d_object";
import { Vec4 } from "../data_formats/vec/vec4";
import { Material, MaterialLocation } from "../material";
import { ShaderProgram } from "../shader_program";
import { Positionable } from "../traits/positionable";
import { Identifiable } from "./indentifiable";

export class Game3DObject extends Positionable implements Identifiable {

    private _id: number;
    private _idVec: Vec4;
    private _name: string;
    private object: I3DObject;
    private material: Material;
    private shader: ShaderProgram;
    colorOverlay: Vec4 = new Vec4(0, 0, 0, 1);
    
    constructor(id: number, name: string, object: I3DObject, material: Material, shader: ShaderProgram) {
        super();
        this._id = id;
        this._idVec = Vec4.fromId(id);
        this._name = name;
        this.object = object;
        this.material = material;
        this.shader = shader;
    }

    draw(overwriteShaderProgram?: ShaderProgram) {
        let shader = overwriteShaderProgram || this.shader;

        shader.setUniformMat4f('u_model', this.modelMatrix);

        if (shader.hasMaterialUniforms())
            this.material.bind(shader.materialUniforms as MaterialLocation);

        shader.setUniformVec4('u_overlay_color', this.colorOverlay, true);

        this.object.draw();
    }

    public get id() {
        return this._id;
    }

    public get idVec4() {
        return this._idVec;
    }

    public get name() {
        return this._name;
    }
}