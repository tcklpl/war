import { BadMatrixLengthError } from "../../../errors/engine/data/bad_matrix_length";
import { IUniformBindable } from "../traits/i_uniform_bindable";
import { Mat4 } from "./mat4";

export class Mat3 implements IUniformBindable {

    values: number[] = new Array<number>(9);

    constructor(values: number[]) {
        if (values.length != 9) throw new BadMatrixLengthError(`Trying to create a 3x3 matrix with ${values.length} elements`);
        this.values = values;
    }

    static get byteSize() {
        return 3 * 3 * 4;
    }

    get asF32Array() {
        return new Float32Array(this.values);
    }

    get asMat4() {
        return new Mat4([
            this.values[0 * 3 + 0],
            this.values[0 * 3 + 1],
            this.values[0 * 3 + 2],
            0,
            this.values[1 * 3 + 0],
            this.values[1 * 3 + 1],
            this.values[1 * 3 + 2],
            0,
            this.values[2 * 3 + 0],
            this.values[2 * 3 + 1],
            this.values[2 * 3 + 2],
            0,
            0,
            0,
            0,
            1
        ]);
    }

    bindUniform(to: WebGLUniformLocation): void {
        gl.uniformMatrix3fv(to, false, this.asF32Array);
    }

    // -----------------[ STATIC UTILS ]-----------------

    static identity() {
        return new Mat3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }
    
}