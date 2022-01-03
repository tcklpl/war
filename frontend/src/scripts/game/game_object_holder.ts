import { I3DObject } from "../engine/data_formats/3d_object";
import { Vec4 } from "../engine/data_formats/vec/vec4";
import { Material } from "../engine/material";
import { Game3DObject } from "../engine/objects/game3d_obj";
import { ShaderProgram } from "../engine/shader_program";

export class GameObjectHolder {

    private currentId: number = 1;
    private objects: Game3DObject[] = [];

    construct3dObject(name: string, object: I3DObject, material: Material, shader: ShaderProgram) {
        let obj = new Game3DObject(this.currentId++, name, object, material, shader);
        this.objects.push(obj);
        return obj;
    }

    getObjectByName(name: string) {
        return this.objects.find(x => x.name == name);
    }

    getObjectById(id: number) {
        return this.objects.find(x => x.id == id);
    }

    public get allObjects(): Game3DObject[] {
        return this.objects;
    }
}