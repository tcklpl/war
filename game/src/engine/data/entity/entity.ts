import { PrincipledBSDFShader } from "../../../shaders/principled_bsdf/principled_bsdf_shader";
import { Mesh } from "../meshes/mesh";
import { identifiable } from "../traits/identifiable";
import { MatrixTransformative } from "./matrix_transformative";


const EntityBase = identifiable(MatrixTransformative);

export class Entity extends EntityBase {

    visible: boolean = true;

    private _name: string;
    private _mesh: Mesh;
    
    private _pipelineBindGroups = new Map<GPURenderPipeline, GPUBindGroup>();

    constructor(data: {name: string, mesh: Mesh}) {
        super();
        this._name = data.name;
        this._mesh = data.mesh;
    }
    
    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const newBindGroup = device.createBindGroup({
            label: `Entity '${this._name}' model matrix`,
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.VERTEX_MODEL),
            entries: [
                { binding: 0, resource: { buffer: this.modelMatrixUniformBuffer }}
            ]
        });
        this._pipelineBindGroups.set(pipeline, newBindGroup);
        return newBindGroup;
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
        passEncoder.setBindGroup(PrincipledBSDFShader.UNIFORM_BINDING_GROUPS.VERTEX_MODEL, this.getBindGroup(pipeline));
        this._mesh.draw(passEncoder, pipeline, options);
    }

    registerChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = this;
            this.children.push(c);
        });
    }

    removeChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = undefined;
        });
        this.children = this.children.filter(c => !children.find(x => x === c));
    }

    clearChildren() {
        this.removeChildren(...this.children);
    }

    get name() {
        return this._name;
    }

}