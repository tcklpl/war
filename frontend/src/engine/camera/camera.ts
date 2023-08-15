import { Mat3 } from "../data/mat/mat3";
import { Mat4 } from "../data/mat/mat4";
import { Vec3 } from "../data/vec/vec3";

export abstract class Camera {

    private _pos: Vec3;
    private _up: Vec3;

    private _cameraMatrix!: Mat4;
    private _viewMatrix!: Mat4;
    private _viewMatrixNoTranslation!: Mat3;

    constructor(pos: Vec3, up: Vec3) {
        this._pos = pos;
        this._up = up;
    }

    abstract generateCameraMatrix(): void;

    protected set cameraMatrix(m: Mat4) {
        this._cameraMatrix = m;
        this._viewMatrix = m.inverse;
        this._viewMatrixNoTranslation = m.topLeft;
    }

    get cameraMatrix() {
        return this._cameraMatrix;
    }

    get viewMatrix() {
        return this._viewMatrix;
    }

    get viewMatrixNoTranslation() {
        return this._viewMatrixNoTranslation;
    }

    get position() {
        return this._pos;
    }

    get up() {
        return this._up;
    }

    set position(pos: Vec3) {
        this._pos = pos;
        this.generateCameraMatrix();
    }
}