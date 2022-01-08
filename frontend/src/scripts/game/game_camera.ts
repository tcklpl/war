import { LookAtCamera } from "../engine/camera/lookat_camera";
import { MUtils } from "../engine/data_formats/math_utils";
import { Vec3 } from "../engine/data_formats/vec/vec3";
import { IMouseListener } from "../engine/traits/mouse_listener";
import { ITimeSensitive } from "../engine/traits/time_sensitive";
import { Game } from "../game";

export class GameCamera extends LookAtCamera implements ITimeSensitive, IMouseListener {

    private gl: WebGL2RenderingContext = Game.instance.getGL();
    private movingDirection: Vec3 = new Vec3(0, 0, 0);
    private movingAcceleration: number = 2;

    private posLowerBound: Vec3 = new Vec3(-7, 5, -3);
    private posUpperBound: Vec3 = new Vec3(7, 15, 3);



    constructor() {
        super(new Vec3(0, 10, 0), new Vec3(0, 0, -1), new Vec3(0, 0, 0));
        Game.instance.keyboard.registerListener(this);
        Game.instance.mouse.registerMouseListener(this);
        Game.instance.engine.registerPreDrawListener(this);
    }

    onMouseMove(mouseX: number, mouseY: number) {
        let x = MUtils.normalize(0, this.gl.canvas.width, mouseX) * 2 - 1;
        let z = MUtils.normalize(0, this.gl.canvas.height, mouseY) * 2 - 1;

        x = x * x * x; 
        z = z * z * z;

        this.target.x = this.worldPos.x + x;
        this.target.z = this.worldPos.z + z;

        this.generateViewMatrix();
    }

    update(deltaTime: number): void {
        if (this.movingDirection.differentFrom(Vec3.zero)) {

            let velocity = deltaTime * this.movingAcceleration;
            let xMovement = this.movingDirection.x * velocity;
            let yMovement = this.movingDirection.y * velocity;
            let zMovement = this.movingDirection.z * velocity;

            if (this.movingDirection.x != 0 && MUtils.isBetween(this.posLowerBound.x, this.posUpperBound.x, this.worldPos.x + xMovement)) {
                this.worldPos.x += xMovement;
                this.target.x += xMovement;
            }

            if (this.movingDirection.y != 0 && MUtils.isBetween(this.posLowerBound.y, this.posUpperBound.y, this.worldPos.y + yMovement)) {
                this.worldPos.y += yMovement;
            }

            if (this.movingDirection.z != 0 && MUtils.isBetween(this.posLowerBound.z, this.posUpperBound.z, this.worldPos.z + zMovement)) {
                this.worldPos.z += zMovement;
                this.target.z += zMovement;
            }

            this.generateViewMatrix();
        }
    }

    onMouseScroll(deltaY: number) {
        this.movingDirection.y = MUtils.clamp(-1, 1, deltaY);
    }

    onMouseScrollStop() {
        this.movingDirection.y = 0;
    }

    onKeyDownW() {
        this.movingDirection.z -= 1;
    }

    onKeyUpW() {
        this.movingDirection.z += 1;
    }

    onKeyDownA() {
        this.movingDirection.x -= 1;
    }

    onKeyUpA() {
        this.movingDirection.x += 1;
    }

    onKeyDownS() {
        this.movingDirection.z += 1;
    }

    onKeyUpS() {
        this.movingDirection.z -= 1;
    }

    onKeyDownD() {
        this.movingDirection.x += 1;
    }

    onKeyUpD() {
        this.movingDirection.x -= 1;
    }

    onKeyDownSHIFT() {
        this.movingAcceleration = 4;
    }

    onKeyUpSHIFT() {
        this.movingAcceleration = 2;
    }
    
}