import { BufferUtils } from "../../utils/buffer_utils";
import { Mat4 } from "../data/mat/mat4";
import { Quaternion } from "../data/quaternion/quaternion";
import { Vec3 } from "../data/vec/vec3";

export class MatrixTransformative {

    private _parent?: MatrixTransformative;

    private _translation = Vec3.fromValue(0);
    private _rotation = Quaternion.fromEulerAngles(0, 0, 0);
    private _scale = Vec3.fromValue(1);

    private _translationMatrix = Mat4.identity();
    private _rotationMatrix = Mat4.identity();
    private _scaleMatrix = Mat4.identity();

    private _modelMatrix = Mat4.identity();
    private _modelMatrixUniformBuffer = BufferUtils.createEmptyBuffer(Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

    private buildModelMatrix() {
        this._modelMatrix = Mat4.identity();
        this._modelMatrix.multiplyBy(this._translationMatrix);
        this._modelMatrix.multiplyBy(this._rotationMatrix);
        this._modelMatrix.multiplyBy(this._scaleMatrix);

        if (this._parent) {
            this._modelMatrix = this._parent.modelMatrix.duplicate().multiplyBy(this._modelMatrix);
        }

        device.queue.writeBuffer(this._modelMatrixUniformBuffer, 0, this._modelMatrix.asF32Array);
    }

    get translation() {
        return this._translation;
    }

    set translation(t: Vec3) {
        this._translation = t;
        this._translationMatrix = Mat4.translation(t.x, t.y, t.z);
        this.buildModelMatrix();
    }

    get rotationQuaternion() {
        return this._rotation;
    }

    set rotationQuaternion(q: Quaternion) {
        this._rotation = q;
        this._rotationMatrix = this._rotation.asMat4;
        this.buildModelMatrix();
    }

    set rotationEuler(r: Vec3) {
        this._rotation = Quaternion.fromEulerAngles(r.x, r.y, r.z);
        this._rotationMatrix = this._rotation.asMat4;
        this.buildModelMatrix();
    }

    get scale() {
        return this._scale;
    }

    set scale(s: Vec3) {
        this._scale = s;
        this._scaleMatrix = Mat4.scaling(s.x, s.y, s.z);
        this.buildModelMatrix();
    }

    get modelMatrix() {
        return this._modelMatrix;
    }

    get parent() {
        return this._parent;
    }

    set parent(p: MatrixTransformative | undefined) {
        this._parent = p;
        this.buildModelMatrix();
    }

    get modelMatrixUniformBuffer() {
        return this._modelMatrixUniformBuffer;
    }

}