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

    draw(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline, options = {
        position: {
            use: true,
            index: 0
        },
        uv: {
            use: true,
            index: 1
        },
        normal: {
            use: true,
            index: 2
        },
        tangent: {
            use: true,
            index: 3
        },
        useMaterial: true
    }) {
        this._primitives.forEach(p => p.draw(passEncoder, pipeline, options));
    }

    free() {
        this._primitives.forEach(p => p.free());
    }

}