import { PrincipledBSDFShader } from '../../../shaders/geometry/principled_bsdf/principled_bsdf_shader';
import { MathUtils } from '../../../utils/math_utils';
import { Mat4 } from '../mat/mat4';
import { Mesh } from '../meshes/mesh';
import { PrimitiveDrawOptions } from '../meshes/primitive_draw_options';
import { identifiable } from '../traits/identifiable';
import { puppet } from '../traits/puppet';
import { Vec3 } from '../vec/vec3';
import { Vec4 } from '../vec/vec4';
import { FrameListenerMatrixTransformative } from './frame_listener_matrix_transformative';
import { MatrixTransformative } from './matrix_transformative';

const EntityBase = identifiable(puppet(FrameListenerMatrixTransformative));

export class Entity extends EntityBase {
    visible: boolean = true;

    private readonly _name: string;
    private readonly _mesh: Mesh;

    private _overlayColor = Vec3.fromValue(0);
    private _overlayIntensity = 0;

    private readonly _pipelineBindGroups = new Map<GPURenderPipeline, GPUBindGroup>();

    constructor(data: { name: string; mesh: Mesh }) {
        super();
        this._name = data.name;
        this._mesh = data.mesh;
        // write id to buffer
        device.queue.writeBuffer(this.modelMatrixUniformBuffer, 3 * Mat4.byteSize + Vec4.byteSize, this.idUint32);
    }

    getBindGroup(pipeline: GPURenderPipeline) {
        const result = this._pipelineBindGroups.get(pipeline);
        if (result) return result;

        const newBindGroup = device.createBindGroup({
            label: `Entity '${this._name}' model matrix`,
            layout: pipeline.getBindGroupLayout(PrincipledBSDFShader.BINDING_GROUPS.MODEL),
            entries: [{ binding: 0, resource: { buffer: this.modelMatrixUniformBuffer } }],
        });
        this._pipelineBindGroups.set(pipeline, newBindGroup);
        return newBindGroup;
    }

    draw(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline, options: PrimitiveDrawOptions) {
        passEncoder.setBindGroup(PrincipledBSDFShader.BINDING_GROUPS.MODEL, this.getBindGroup(pipeline));
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

    get overlayColor() {
        return this._overlayColor;
    }

    get overlayIntensity() {
        return this._overlayIntensity;
    }

    set overlayColor(color: Vec3) {
        this._overlayColor = color;
        device.queue.writeBuffer(this.modelMatrixUniformBuffer, 3 * Mat4.byteSize, this._overlayColor.asF32Array);
    }

    set overlayIntensity(intensity: number) {
        const clampedIntensity = MathUtils.clamp(0, 1, intensity);
        this._overlayIntensity = clampedIntensity;
        device.queue.writeBuffer(
            this.modelMatrixUniformBuffer,
            3 * Mat4.byteSize + Vec3.byteSize,
            new Float32Array([this._overlayIntensity]),
        );
    }
}
