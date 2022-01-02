import { Vec2 } from "./vec2";

export class Vec3 extends Vec2 {

    z: number;

    constructor(x: number, y: number, z: number) {
        super(x, y);
        this.z = z;
    }

    asArray(): number[] {
        return [this.x, this.y, this.z];
    }

    add(v: Vec3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    divide(factor: number) {
        this.x /= factor;
        this.y /= factor;
        this.z /= factor;
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static add(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z
        );
    }

    static subtract(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z
        );
    }

    static normalize(v: Vec3) {
        let length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        // no division by 0
        return length > 0.00001 ? new Vec3(v.x / length, v.y / length, v.z / length) : new Vec3(0, 0, 0);
    }

    static centroid(v: Vec3[]): Vec3 {
        let accumulated = v.reduce((accumulated, current) => Vec3.add(accumulated, current));
        accumulated.divide(v.length);
        return accumulated;
    }

}