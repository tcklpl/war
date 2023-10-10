import { MathUtils } from "../../../utils/math_utils";
import { Mat4 } from "../../data/mat/mat4";
import { Vec2 } from "../../data/vec/vec2";
import { Resolution } from "../../resolution";

export class RenderProjection {

    private _near = 0.9;
    private _far = 30;
    private _resolution = new Resolution(new Vec2(gpuCtx.canvas.width, gpuCtx.canvas.height));
    private _fovY = 60;

    private _projectionMatrix!: Mat4;
    private _inverseProjectionMatrix!: Mat4;

    private _previousFrameProjectionMatrix!: Mat4;
    private _previousFrameInverseProjectionMatrix!: Mat4;

    constructor() {
        this.buildProjectionMatrices();
    }

    initialize() {
        game.engine.registerFrameListener({
            onEachFrame: delta => this.updatePreviousFrameMatrices()
        });
    }

    private buildProjectionMatrices() {
        this._projectionMatrix = Mat4.perspective(
            MathUtils.degToRad(this._fovY),
            this._resolution.aspectRatio,
            this._near, 
            this._far
        );
        this._inverseProjectionMatrix = this._projectionMatrix.inverse();
        this.updatePreviousFrameMatrices();
    }

    updateResolution(fullSize: Vec2) {
        this._resolution.full = fullSize;
        this.buildProjectionMatrices();    
    }

    updatePreviousFrameMatrices() {
        this._previousFrameProjectionMatrix = this._projectionMatrix;
        this._previousFrameInverseProjectionMatrix = this._inverseProjectionMatrix;
    }

    get near() {
        return this._near;
    }

    set near(n: number) {
        this._near = n;
        this.buildProjectionMatrices();
    }

    get far() {
        return this._far;
    }

    set far(f: number) {
        this._far = f;
        this.buildProjectionMatrices();
    }

    get fovY() {
        return this._fovY;
    }

    set fovY(f: number) {
        this._fovY = f;
        this.buildProjectionMatrices();
    }

    get resolution() {
        return this._resolution;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    get inverseProjectionMatrix() {
        return this._inverseProjectionMatrix;
    }

    get previousFrameProjectionMatrix() {
        return this._previousFrameProjectionMatrix;
    }

    get previousFrameInverseProjectionMatrix() {
        return this._previousFrameInverseProjectionMatrix;
    }

}