import { LookAtCamera } from "../../engine/data/camera/lookat_camera";
import { frameListener } from "../../engine/data/traits/frame_listener";
import { Vec2 } from "../../engine/data/vec/vec2";
import { Vec3 } from "../../engine/data/vec/vec3";
import { keyboardListener } from "../../engine/io/keyboard_listener";
import { mouseListener } from "../../engine/io/mouse_listener";
import { MathUtils } from "../../utils/math_utils";

const BoardCameraBase = keyboardListener(mouseListener(frameListener(LookAtCamera)));

export class BoardCamera extends BoardCameraBase {

    private _moveSpeed = 5;
    private _moveSpeedSlow = 5;
    private _moveSpeedFast = 10;

    private _deltaX = 0;
    private _deltaY = 0;
    private _deltaZ = 0;

    private _camTarget: Vec3;
    private _tDeltaX = 0;
    private _tDeltaZ = 0;

    private _startPosition = new Vec3(0, 5, 0);
    private _lBound = new Vec3(-5, -20, -3);
    private _hBound = new Vec3(5, 10, 3);

    constructor() {
        // const camera = game.engine.managers.asset.getGLTFAsset('board').gltfFile.defaultScene.cameras[0];
        const p = new Vec3(0, 5, 0);
        const t = new Vec3(0, 0, 0);
        const u = new Vec3(0, 0, -1);

        
        super(p, t, u);
        this._camTarget = t;
        this.registerKeyEvents();
    }

    private registerKeyEvents() {

        this.onKeyDown('w', () => this.deltaZ = this.deltaZ - 1);
        this.onKeyUp('w', () => this.deltaZ = this.deltaZ + 1);

        this.onKeyDown('s', () => this.deltaZ = this.deltaZ + 1);
        this.onKeyUp('s', () => this.deltaZ = this.deltaZ - 1);

        this.onKeyDown('d', () => this.deltaX = this.deltaX + 1);
        this.onKeyUp('d', () => this.deltaX = this.deltaX - 1);

        this.onKeyDown('a', () => this.deltaX = this.deltaX - 1);
        this.onKeyUp('a', () => this.deltaX = this.deltaX + 1);

        this.onKeyDown('shift', () => this._moveSpeed = this._moveSpeedFast);
        this.onKeyUp('shift', () => this._moveSpeed = this._moveSpeedSlow);
    }
    
    onEachFrame(deltaTime: number): void {
        if (this._deltaX === 0 && this._deltaY === 0 && this._deltaZ === 0) return;
        this.position.x += this._deltaX * this._moveSpeed * deltaTime;
        this.position.y += this._deltaY * this._moveSpeed * deltaTime;
        this.position.z += this._deltaZ * this._moveSpeed * deltaTime;

        this.position = Vec3.clamp(this._lBound, this._hBound, this.position);

        this._camTarget = this.position.clone();
        this._camTarget.x += this._tDeltaX;
        this._camTarget.y -= 5;
        this._camTarget.z += this._tDeltaZ;
        // this.target = this._camTarget;
        
        this.generateCameraMatrix();
    }

    onMouseScroll(dy: number): void {
        this._deltaY = MathUtils.clamp(-1, 1, dy) * this._moveSpeed / 50;
    }

    onMouseScrollStop(): void {
        this._deltaY = 0;
    }

    onMouseMoveOffset(offset: Vec2): void {
        this._tDeltaX = MathUtils.clamp(-0.1, 0.1, offset.x);
        this._tDeltaZ = MathUtils.clamp(-0.1, 0.1, offset.y);
    }

    onMouseStop(): void {
        this._tDeltaX = 0;
        this._tDeltaZ = 0;
    }

    private get deltaX() {
        return this._deltaX;
    }

    private set deltaX(d: number) {
        this._deltaX = MathUtils.clamp(-1, 1, d);
    }

    private get deltaY() {
        return this._deltaY;
    }

    private set deltaY(d: number) {
        this._deltaY = MathUtils.clamp(-1, 1, d);
    }

    private get deltaZ() {
        return this._deltaZ;
    }

    private set deltaZ(d: number) {
        this._deltaZ = MathUtils.clamp(-1, 1, d);
    }

}