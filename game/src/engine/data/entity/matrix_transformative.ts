import { BufferUtils } from "../../../utils/buffer_utils";
import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../mat/mat4";
import { Quaternion } from "../quaternion/quaternion";
import { Vec3 } from "../vec/vec3";


export class MatrixTransformative {

    private _parent?: MatrixTransformative;
    private _children: MatrixTransformative[] = [];

    private _translation = Vec3.fromValue(0);
    private _rotation = Quaternion.fromEulerAnglesRadians(0, 0, 0);
    private _scale = Vec3.fromValue(1);

    private _translationMatrix = Mat4.identity();
    private _rotationMatrix = Mat4.identity();
    private _scaleMatrix = Mat4.identity();

    private _modelMatrix = Mat4.identity();
    private _modelMatrixInverse = Mat4.identity();
    private _modelMatrixUniformBuffer = BufferUtils.createEmptyBuffer(2 * Mat4.byteSize, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

    private _windingOrder: 'cw' | 'ccw' = 'ccw';

    private buildModelMatrix() {
        this._modelMatrix = Mat4.identity();
        this._modelMatrix.multiplyBy(this._translationMatrix);
        this._modelMatrix.multiplyBy(this._rotationMatrix);
        this._modelMatrix.multiplyBy(this._scaleMatrix);

        if (this._parent) {
            this._modelMatrix = this._parent.modelMatrix.duplicate().multiplyBy(this._modelMatrix);
        }

        this._modelMatrixInverse = this._modelMatrix.inverse();

        // models that have a negative transformation matrix should be drawn in clockwise winding order, this allows mirrored geometry
        this._windingOrder = this._modelMatrix.determinant >= 0 ? 'ccw' : 'cw';

        device.queue.writeBuffer(this._modelMatrixUniformBuffer, 0, this._modelMatrix.asF32Array);
        device.queue.writeBuffer(this._modelMatrixUniformBuffer, Mat4.byteSize, this._modelMatrixInverse.asF32Array);

        // update children
        this._children.forEach(c => c.buildModelMatrix());
    }

    buildTranslationMatrix() {
        this._translationMatrix = Mat4.translation(this._translation.x, this._translation.y, this._translation.z);
    }

    buildRotationMatrix() {
        this._rotationMatrix = this._rotation.asMat4;
    }

    buildScaleMatrix() {
        this._scaleMatrix = Mat4.scaling(this._scale.x, this._scale.y, this._scale.z);
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
        this.buildRotationMatrix();
        this.buildModelMatrix();
    }

    set rotationEulerRadians(r: Vec3) {
        this._rotation = Quaternion.fromEulerAnglesRadians(r.x, r.y, r.z);
        this.buildRotationMatrix();
        this.buildModelMatrix();
    }

    set rotationEulerDegrees(r: Vec3) {
        this._rotation = Quaternion.fromEulerAnglesRadians(MathUtils.degToRad(r.x), MathUtils.degToRad(r.y), MathUtils.degToRad(r.z));
        this.buildRotationMatrix();
        this.buildModelMatrix();
    }

    get scale() {
        return this._scale;
    }

    set scale(s: Vec3) {
        this._scale = s;
        this.buildScaleMatrix();
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

    get children() {
        return this._children;
    }

    set children(c: MatrixTransformative[]) {
        this._children = c;
    }

    get modelMatrixUniformBuffer() {
        return this._modelMatrixUniformBuffer;
    }

    get windingOrder() {
        return this._windingOrder;
    }

}