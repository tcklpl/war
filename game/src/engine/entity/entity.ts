import { PBRShader } from "../../shaders/pbr/pbr_shader";
import { Mesh } from "../data/meshes/mesh";
import { identifiable } from "../data/traits/identifiable";
import { MatrixTransformative } from "./matrix_transformative";


const EntityBase = identifiable(MatrixTransformative);

export class Entity extends EntityBase {

    visible: boolean = true;

    private _children: MatrixTransformative[] = [];

    private _name: string;
    private _mesh: Mesh;
    
    private _modelBindGroup: GPUBindGroup;

    constructor(data: {name: string, mesh: Mesh}) {
        super();
        this._name = data.name;
        this._mesh = data.mesh;

        this._modelBindGroup = device.createBindGroup({
            layout: game.engine.renderer.pbrPipeline.getBindGroupLayout(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_MODEL),
            entries: [
                { binding: 0, resource: { buffer: this.modelMatrixUniformBuffer }}
            ]
        });
    }

    draw(passEncoder: GPURenderPassEncoder) {
        passEncoder.setBindGroup(PBRShader.UNIFORM_BINDING_GROUPS.VERTEX_MODEL, this._modelBindGroup);
        this._mesh.draw(passEncoder);
    }

    registerChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = this;
            this._children.push(c);
        });
    }

    removeChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = undefined;
        });
        this._children = this._children.filter(c => !children.find(x => x === c));
    }

    clearChildren() {
        this.removeChildren(...this._children);
    }

    get name() {
        return this._name;
    }

    get children() {
        return this._children;
    }
}