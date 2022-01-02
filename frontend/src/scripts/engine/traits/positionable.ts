import { Mat4 } from "../data_formats/mat/mat4";
import { MUtils } from "../data_formats/math_utils";
import { Vec3 } from "../data_formats/vec/vec3";
import { IMovable } from "./movable";

export class Positionable implements IMovable {
    
    protected worldPos: Vec3 = new Vec3(0, 0, 0);
    protected rotation: Vec3 = new Vec3(0, 0, 0);
    protected objectScale: Vec3 = new Vec3(1, 1, 1);
    protected modelMatrix: Mat4 = Mat4.identity();

    translate(offset: Vec3): void {
        this.worldPos.add(offset);
        this.generateModelMatrix();
    }

    setTranslation(to: Vec3): void {
        this.worldPos = to;
        this.generateModelMatrix();
    }

    rotate(offset: Vec3): void {
        this.rotation.add(offset);
        this.generateModelMatrix();
    }

    setRotation(to: Vec3): void {
        this.rotation = to;
        this.generateModelMatrix();
    }

    scale(magnitude: Vec3): void {
        this.objectScale.add(magnitude);
        this.generateModelMatrix();
    }

    setScale(to: Vec3): void {
        this.objectScale = to;
        this.generateModelMatrix();
    }

    protected generateModelMatrix(): void {
        this.modelMatrix = Mat4.identity();
        this.modelMatrix.multiplyBy(Mat4.scaling(this.objectScale.x, this.objectScale.y, this.objectScale.z));
        this.modelMatrix.multiplyBy(Mat4.xRotation(MUtils.degToRad(this.rotation.x)));
        this.modelMatrix.multiplyBy(Mat4.yRotation(MUtils.degToRad(this.rotation.y)));
        this.modelMatrix.multiplyBy(Mat4.zRotation(MUtils.degToRad(this.rotation.z)));
        this.modelMatrix.multiplyBy(Mat4.translation(this.worldPos.x, this.worldPos.y, this.worldPos.z));
    }
    
};