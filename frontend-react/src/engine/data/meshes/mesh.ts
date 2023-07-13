import { Primitive } from "./primitive";

export class Mesh {

    private _name: string;
    private _primitives: Primitive[];

    constructor(name: string, primitives: Primitive[]) {
        this._name = name;
        this._primitives = primitives;
    }

    get name() {
        return this._name;
    }

    draw(passEncoder: GPURenderPassEncoder) {
        this._primitives.forEach(p => p.draw(passEncoder));
    }

    delete() {
        this._primitives.forEach(p => p.delete());
    }

}