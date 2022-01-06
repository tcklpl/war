import { Vec3 } from "./data_formats/vec/vec3";

export class Interpolators {

    /**
     * Interpolates x numbers between a and b linearly.
     * @param a Inferior limit.
     * @param b Superior limit.
     * @param steps Number of values to generate in between a and b.
     * @returns List of interpolated values.
     * 
     * eg.
     * 
     * numericLinear(0, 3, 5)
     * [0.5, 1, 1.5, 2, 2.5]
     */
    static numericLinear(a: number, b: number, steps: number) {
        let res: number[] = [];
        let value = a;
        let step = (b - a) / (steps + 1);
        for (let i = 0; i < steps; i++) {
            value += step;
            res.push(value);
        }
        return res;
    }

    /**
     * Interpolates 1 number between a and b.
     * @param a Inferior limit.
     * @param b Superior limit.
     * @param steps Number of valies between a and b.
     * @param step The 1-based index of the desired value.
     * @returns The x-interpolated value.
     * 
     * eg.
     * 
     * numericLinearSingleValue(0, 3, 5, 3)
     * 1.5
     */
    static numericLinearSingleValue(a: number, b: number, steps: number, step: number) {
        return a + (b - a) / (steps + 1) * step;
    }

    /**
     * Returns a list of interpolated vec3s between a and b.
     * @param a Inferior limit.
     * @param b Superior limit.
     * @param steps Number of vec3s to generate in between a and b.
     * @returns List of interpolated vec3s.
     */
    static vec3Linear(a: Vec3, b: Vec3, steps: number) {
        let res: Vec3[] = [];
        let xs = this.numericLinear(a.x, b.x, steps);
        let ys = this.numericLinear(a.y, b.y, steps);
        let zs = this.numericLinear(a.z, b.z, steps);
        for (let i = 0; i < steps; i++) {
            res.push(new Vec3(xs[i], ys[i], zs[i]));
        }
        return res;
    }

    /**
     * Returns a single Vec3 interpolated between a and b.
     * @param a Inferior limit.
     * @param b Superior limit.
     * @param steps Number of vec3s that wold be generated between a and b.
     * @param step The 1-based index of the desired value.
     * @returns Interpolated vec3.
     */
    static vec3LinearSingleValue(a: Vec3, b: Vec3, steps: number, step: number) {
        let x = this.numericLinearSingleValue(a.x, b.x, steps, step);
        let y = this.numericLinearSingleValue(a.y, b.y, steps, step);
        let z = this.numericLinearSingleValue(a.z, b.z, steps, step);
        return new Vec3(x, y, z);
    } 

}