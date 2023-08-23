import { Mat4 } from "../mat/mat4";
import { Vec3 } from "../vec/vec3";

export abstract class Camera {

    private _pos: Vec3;
    private _up: Vec3;

    private _cameraMatrix!: Mat4;
    private _viewMatrix!: Mat4;

    constructor(pos: Vec3, up: Vec3) {
        this._pos = pos;
        this._up = up;
    }

    abstract generateCameraMatrix(): void;

    protected set cameraMatrix(m: Mat4) {
        this._cameraMatrix = m;
        this._viewMatrix = m.inverse();
    }

    get cameraMatrix() {
        return this._cameraMatrix;
    }

    get viewMatrix() {
        return this._viewMatrix;
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