
export class Interpolators {

    static numericLinear(a: number, b: number, steps: number) {
        let res: number[] = [];
        res.push(a);
        let value = a;
        let step = (b - a) / steps;
        for (let i = 0; i < steps; i++) {
            value += step;
            res.push(value);
        }
        return res;
    }

}