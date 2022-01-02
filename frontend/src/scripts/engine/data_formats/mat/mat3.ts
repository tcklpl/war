export class Mat3 {

    values: number[] = new Array<number>(9);

    constructor(values: number[]) {
        if (values.length != 9) throw `Failed to create 3x3 matrix with ${values.length} values`;
        this.values = values;
    }

    set(row: number, col: number, value: number) {
        if (row > 2 || col > 2) throw `Cannot access position ${row}-${col} on a 3x3 matrix`;
        this.values[row * 3 + col] = value;
    }

    get(row: number, col: number): number {
        if (row > 2 || col > 2) throw `Cannot access position ${row}-${col} on a 3x3 matrix`;
        return this.values[row * 3 + col];
    }

    static identity(): Mat3 {
        return new Mat3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }
}