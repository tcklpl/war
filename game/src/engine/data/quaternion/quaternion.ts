import { BadQuaternionLengthError } from '../../../errors/engine/data/bad_quaternion_length';
import { MathUtils } from '../../../utils/math_utils';
import { Mat4 } from '../mat/mat4';
import { Vec3 } from '../vec/vec3';

export class Quaternion {
    constructor(
        public w: number,
        public x: number,
        public y: number,
        public z: number,
    ) {}

    normalize() {
        const d = Math.sqrt(this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Quaternion(this.w / d, this.x / d, this.y / d, this.z / d);
    }

    clone() {
        return new Quaternion(this.w, this.x, this.y, this.z);
    }

    inverse() {
        return new Quaternion(this.w, -this.x, -this.y, -this.z);
    }

    get asMat4() {
        const x2 = this.x * this.x;
        const y2 = this.y * this.y;
        const z2 = this.z * this.z;

        const wx = this.w * this.x;
        const wy = this.w * this.y;
        const wz = this.w * this.z;
        const xy = this.x * this.y;
        const xz = this.x * this.z;
        const yz = this.y * this.z;

        return new Mat4([
            1 - 2 * y2 - 2 * z2,
            2 * xy + 2 * wz,
            2 * xz - 2 * wy,
            0,
            2 * xy - 2 * wz,
            1 - 2 * x2 - 2 * z2,
            2 * yz + 2 * wx,
            0,
            2 * xz + 2 * wy,
            2 * yz - 2 * wx,
            1 - 2 * x2 - 2 * y2,
            0,
            0,
            0,
            0,
            1,
        ]);
    }

    get asDirectionVector() {
        const x = 2 * (this.x * this.z + this.w * this.y);
        const y = 2 * (this.y * this.z - this.w * this.x);
        const z = 1 - 2 * (this.x * this.x + this.y * this.y);
        return new Vec3(x, y, z);
    }

    multiplyByVec3(v: Vec3) {
        const w = -(this.x * v.x) - this.y * v.y - this.z * v.z;
        const x = this.w * v.x + this.y * v.z - this.z * v.y;
        const y = this.w * v.y + this.z * v.x - this.x * v.z;
        const z = this.w * v.z + this.x * v.y - this.y * v.x;
        return new Quaternion(w, x, y, z);
    }

    multiplyByQuaternion(q: Quaternion) {
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        const x = this.x * q.w + this.w * q.x + this.y * q.z - this.z * q.y;
        const y = this.y * q.w + this.w * q.y + this.z * q.x - this.x * q.z;
        const z = this.z * q.w - this.w * q.z + this.x * q.y - this.y * q.x;
        return new Quaternion(w, x, y, z);
    }

    multiplyByFactor(f: number) {
        return new Quaternion(this.w * f, this.x * f, this.y * f, this.z * f);
    }

    divideByFactor(f: number) {
        return new Quaternion(this.w / f, this.x / f, this.y / f, this.z / f);
    }

    add(q: Quaternion) {
        return new Quaternion(this.w + q.w, this.x + q.x, this.y + q.y, this.z + q.z);
    }

    subtract(q: Quaternion) {
        return new Quaternion(this.w - q.w, this.x - q.x, this.y - q.y, this.z - q.z);
    }

    /**
     * Creates a Quaternion from euler angles
     * @param roll roll in radians
     * @param pitch pitch in radians
     * @param yaw yaw in radians
     */
    static fromEulerAnglesRadians(roll: number, pitch: number, yaw: number) {
        const cosYaw = Math.cos(yaw / 2);
        const sinYaw = Math.sin(yaw / 2);
        const cosPitch = Math.cos(pitch / 2);
        const sinPitch = Math.sin(pitch / 2);
        const cosRoll = Math.cos(roll / 2);
        const sinRoll = Math.sin(roll / 2);

        return new Quaternion(
            cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw,
            sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw,
            cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw,
            cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw,
        );
    }

    static fromEulerAnglesDegrees(roll: number, pitch: number, yaw: number) {
        return this.fromEulerAnglesRadians(
            MathUtils.degToRad(roll),
            MathUtils.degToRad(pitch),
            MathUtils.degToRad(yaw),
        );
    }

    static fromAngleAxis(axis: Vec3, angle: number) {
        const s = Math.sin(angle / 2);
        const u = axis.normalize();
        return new Quaternion(Math.cos(angle / 2), u.x * s, u.y * s, u.z * s);
    }

    static fromArrayWXYZ(v: number[]) {
        if (v.length !== 4)
            throw new BadQuaternionLengthError(`Trying to create quaternion from an array with ${v.length} values`);
        return new Quaternion(v[0], v[1], v[2], v[3]);
    }

    static fromArrayXYZW(v: number[]) {
        if (v.length !== 4)
            throw new BadQuaternionLengthError(`Trying to create quaternion from an array with ${v.length} values`);
        return new Quaternion(v[3], v[0], v[1], v[2]);
    }

    static lookAt(source: Vec3, dest: Vec3, front: Vec3, up: Vec3) {
        const toVector = dest.subtract(source).normalize();

        let rotAxis = Vec3.cross(front, toVector).normalize();
        if (rotAxis.squaredNorm() === 0) {
            rotAxis = up;
        }

        const dot = Vec3.dot(front, toVector);
        const ang = Math.acos(dot);

        return this.fromAngleAxis(rotAxis, ang);
    }

    static dot(a: Quaternion, b: Quaternion) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * Slerp interpolation between quaternions.
     * [   ] commutative
     * [ x ] constant velocity
     * [ x ] torque-minimal
     * Taken from http://number-none.com/product/Understanding%20Slerp,%20Then%20Not%20Using%20It/
     * @param a First quaternion;
     * @param b Second quaternion;
     * @param t The factor: [0, 1] 0 is the first quaternion and 1 is the second one;
     * @returns The interpolated quaternion.
     */
    static slerp(a: Quaternion, b: Quaternion, t: number) {
        // a and b should be unit length or else
        // something broken will happen.

        // Compute the cosine of the angle between the two vectors.
        let dot = this.dot(a, b);
        const DOT_THRESHOLD = 0.9995;

        if (dot > DOT_THRESHOLD) {
            // If the inputs are too close for comfort, linearly interpolate
            // and normalize the result.
            const diff = b.subtract(a);
            return a.add(diff.multiplyByFactor(t)).normalize();
        }

        dot = MathUtils.clamp(0, 1, dot); // Robustness: Stay within domain of acos()
        const theta_0 = Math.acos(dot); // theta_0 = angle between input vectors
        const theta = theta_0 * t; // theta = angle between v0 and result

        const c = b.subtract(a.multiplyByFactor(dot)).normalize();

        return a.multiplyByFactor(Math.cos(theta)).add(c.multiplyByFactor(Math.sin(theta)));
    }
}
