import { BadMatrixLengthError } from "../../../errors/engine/data/bad_matrix_length";
import { Vec3 } from "../vec/vec3";
import { Vec4 } from "../vec/vec4";

export class Mat4 {

    values: number[] = new Array<number>(16);

    constructor(values: number[]) {
        if (values.length !== 16) throw new BadMatrixLengthError(`Trying to create a 4x4 matrix with ${values.length} elements`);
        this.values = values;
    }

    static get byteSize() {
        return 4 * 4 * 4;
    }

    multiplyByMat4(other: Mat4) {
        const a00 = this.values[0 * 4 + 0];
        const a01 = this.values[0 * 4 + 1];
        const a02 = this.values[0 * 4 + 2];
        const a03 = this.values[0 * 4 + 3];
        const a10 = this.values[1 * 4 + 0];
        const a11 = this.values[1 * 4 + 1];
        const a12 = this.values[1 * 4 + 2];
        const a13 = this.values[1 * 4 + 3];
        const a20 = this.values[2 * 4 + 0];
        const a21 = this.values[2 * 4 + 1];
        const a22 = this.values[2 * 4 + 2];
        const a23 = this.values[2 * 4 + 3];
        const a30 = this.values[3 * 4 + 0];
        const a31 = this.values[3 * 4 + 1];
        const a32 = this.values[3 * 4 + 2];
        const a33 = this.values[3 * 4 + 3];
        const b00 = other.values[0 * 4 + 0];
        const b01 = other.values[0 * 4 + 1];
        const b02 = other.values[0 * 4 + 2];
        const b03 = other.values[0 * 4 + 3];
        const b10 = other.values[1 * 4 + 0];
        const b11 = other.values[1 * 4 + 1];
        const b12 = other.values[1 * 4 + 2];
        const b13 = other.values[1 * 4 + 3];
        const b20 = other.values[2 * 4 + 0];
        const b21 = other.values[2 * 4 + 1];
        const b22 = other.values[2 * 4 + 2];
        const b23 = other.values[2 * 4 + 3];
        const b30 = other.values[3 * 4 + 0];
        const b31 = other.values[3 * 4 + 1];
        const b32 = other.values[3 * 4 + 2];
        const b33 = other.values[3 * 4 + 3];
        this.values = [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
        return this;
    }

    multiplyByVec4(v: Vec4) {
        const a00 = this.values[0 * 4 + 0];
        const a01 = this.values[0 * 4 + 1];
        const a02 = this.values[0 * 4 + 2];
        const a03 = this.values[0 * 4 + 3];
        const a10 = this.values[1 * 4 + 0];
        const a11 = this.values[1 * 4 + 1];
        const a12 = this.values[1 * 4 + 2];
        const a13 = this.values[1 * 4 + 3];
        const a20 = this.values[2 * 4 + 0];
        const a21 = this.values[2 * 4 + 1];
        const a22 = this.values[2 * 4 + 2];
        const a23 = this.values[2 * 4 + 3];
        const a30 = this.values[3 * 4 + 0];
        const a31 = this.values[3 * 4 + 1];
        const a32 = this.values[3 * 4 + 2];
        const a33 = this.values[3 * 4 + 3];
        
        return new Vec4(
            (a00 * v.x) + (a01 * v.y) + (a02 * v.z) + (a03 * v.w),
            (a10 * v.x) + (a11 * v.y) + (a12 * v.z) + (a13 * v.w),
            (a20 * v.x) + (a21 * v.y) + (a22 * v.z) + (a23 * v.w),
            (a30 * v.x) + (a31 * v.y) + (a32 * v.z) + (a33 * v.w)
        );
    }

    duplicate() {
        return new Mat4(this.values.map(x => x));
    }

    transpose() {
        return new Mat4([
            this.values[ 0], this.values[ 4], this.values[ 8], this.values[12], 
            this.values[ 1], this.values[ 5], this.values[ 9], this.values[13], 
            this.values[ 2], this.values[ 6], this.values[10], this.values[14], 
            this.values[ 3], this.values[ 7], this.values[11], this.values[15]
        ]);
    }

    inverse() {
        const m00 = this.values[0 * 4 + 0];
        const m01 = this.values[0 * 4 + 1];
        const m02 = this.values[0 * 4 + 2];
        const m03 = this.values[0 * 4 + 3];
        const m10 = this.values[1 * 4 + 0];
        const m11 = this.values[1 * 4 + 1];
        const m12 = this.values[1 * 4 + 2];
        const m13 = this.values[1 * 4 + 3];
        const m20 = this.values[2 * 4 + 0];
        const m21 = this.values[2 * 4 + 1];
        const m22 = this.values[2 * 4 + 2];
        const m23 = this.values[2 * 4 + 3];
        const m30 = this.values[3 * 4 + 0];
        const m31 = this.values[3 * 4 + 1];
        const m32 = this.values[3 * 4 + 2];
        const m33 = this.values[3 * 4 + 3];
        const tmp_0 = m22 * m33;
        const tmp_1 = m32 * m23;
        const tmp_2 = m12 * m33;
        const tmp_3 = m32 * m13;
        const tmp_4 = m12 * m23;
        const tmp_5 = m22 * m13;
        const tmp_6 = m02 * m33;
        const tmp_7 = m32 * m03;
        const tmp_8 = m02 * m23;
        const tmp_9 = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Mat4([
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
        ]);
    }

    get asF32Array() {
        return new Float32Array(this.values);
    }

    get determinant() {
        /*
            00 01 02 03
            10 11 12 13
            20 21 22 23
            30 31 32 33
        */
        const a00 = this.values[0 * 4 + 0];
        const a01 = this.values[0 * 4 + 1];
        const a02 = this.values[0 * 4 + 2];
        const a03 = this.values[0 * 4 + 3];
        const a10 = this.values[1 * 4 + 0];
        const a11 = this.values[1 * 4 + 1];
        const a12 = this.values[1 * 4 + 2];
        const a13 = this.values[1 * 4 + 3];
        const a20 = this.values[2 * 4 + 0];
        const a21 = this.values[2 * 4 + 1];
        const a22 = this.values[2 * 4 + 2];
        const a23 = this.values[2 * 4 + 3];
        const a30 = this.values[3 * 4 + 0];
        const a31 = this.values[3 * 4 + 1];
        const a32 = this.values[3 * 4 + 2];
        const a33 = this.values[3 * 4 + 3];

        let total = 0;
        total += a00 * a11 * a22 * a33;
        total += a10 * a21 * a32 * a03;
        total += a20 * a31 * a02 * a13;
        total += a30 * a01 * a12 * a23;

        total -= a03 * a12 * a21 * a30;
        total -= a13 * a22 * a31 * a00;
        total -= a23 * a32 * a01 * a10;
        total -= a33 * a02 * a11 * a20;

        return total;
    }

    // -----------------[ STATIC UTILS ]-----------------

    static identity(): Mat4 {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static translation(x: number, y: number, z: number): Mat4 {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }

    static scaling(x: number, y: number, z: number): Mat4 {
        return new Mat4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
    }

    static perspective(fovRadians: number, aspect: number, near: number, far: number): Mat4 {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRadians);
        const rangeInv = 1 / (near - far);

        return new Mat4([
            f / aspect , 0 , 0                    , 0,
            0          , f , 0                    , 0,
            0          , 0 , far * rangeInv       , -1,
            0          , 0 , near * far * rangeInv, 0,
        ]);
    }

    static ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return new Mat4([
            2 / (right - left)              , 0                                 , 0                     , 0,
            0                               , 2 / (top - bottom)                , 0                     , 0,
            0                               , 0                                 , 1 / (near - far)      , 0,
            (right + left) / (left - right) , (top + bottom) / (bottom - top)   , near / (near - far)   , 1
        ]);
    }

    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {

        const dx = (right - left);
        const dy = (top - bottom);
        const dz = (near - far);

        return new Mat4([
            2 * near / dx       , 0                     , 0                 , 0,
            0                   , 2 * near / dy         , 0                 , 0,
            (left + right) / dx , (top + bottom) / dy   , far / dz          , -1,
            0                   , 0                     , near * far / dz   , 0
        ]);
    }

    /**
     * Aim matrix, makes an object aim down +Z toward the target.
     * 
     * @param pos Position
     * @param target Target position
     * @param up Vector pointing upwards
     * @returns The aim matrix
     */
    static aim(pos: Vec3, target: Vec3, up: Vec3) {
        const zAxis = Vec3.subtract(target, pos).normalize();
        const xAxis = Vec3.cross(up, zAxis).normalize();
        const yAxis = Vec3.cross(zAxis, xAxis).normalize();

        return new Mat4([
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            pos.x  , pos.y  , pos.z  , 1
        ]);
    }

    static cameraAim(pos: Vec3, target: Vec3, up: Vec3) {
        const zAxis = Vec3.subtract(pos, target).normalize();
        const xAxis = Vec3.cross(up, zAxis).normalize();
        const yAxis = Vec3.cross(zAxis, xAxis).normalize();

        return new Mat4([
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            pos.x  , pos.y  , pos.z  , 1
        ]);
    }

    static lookAt(pos: Vec3, target: Vec3, up: Vec3): Mat4 {
        let zAxis = Vec3.subtract(pos, target).normalize();
        let xAxis = Vec3.cross(up, zAxis).normalize();
        let yAxis = Vec3.cross(zAxis, xAxis).normalize();

        return new Mat4([
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            -(xAxis.x * pos.x + xAxis.y * pos.y + xAxis.z * pos.z),
            -(yAxis.x * pos.x + yAxis.y * pos.y + yAxis.z * pos.z),
            -(zAxis.x * pos.x + zAxis.y * pos.y + zAxis.z * pos.z),
            1
        ]);
    }
    
}