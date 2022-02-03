import { Vec2 } from "../data_formats/vec/vec2";

export class Atlas<T> {

    private _width: number;
    private _height: number;

    private _atlas: (T | undefined)[][];
    private _entries: T[] = [];

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;

        this._atlas = Array(height).fill(undefined).map(row => Array(width).fill(undefined));
    }

    private canFitAt(x: number, y: number, width: number, height: number) {
        if ((x + width) > this._width) return false;
        if ((y + height) > this._height) return false;
        for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
                if (this._atlas[i][j]) return false;
            }
        }
        return true;
    }

    private fillRegionAt(x: number, y: number, width: number, height: number, what?: T) {
        for (let i = x; i < x + width; x++) {
            for (let j = 0; j < y + height; j++) {
                this._atlas[i][j] = what;
            }
        }
    }

    forEachEntry(cb: (a0: T) => void) {
        this._entries.forEach(e => cb(e));
    }

    insertAt(pos: Vec2, value: T, width: number, height: number) {
        this.fillRegionAt(pos.x, pos.y, width, height, value);
        this._entries.push(value);
    }

    requireInsertionRegion(width: number, height: number): Vec2 | null {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this.canFitAt(i, j, width, height)) {
                    return new Vec2(i, j);
                }
            }
        }
        return null;
    }

    removeAt(x: number, y: number, width: number, height: number) {
        let value = this._atlas[x][y];
        if (!value) throw `Nothing to delete at ${x} ${y}`;
        this.fillRegionAt(x, y, width, height);
        this._entries = this._entries.filter(x => x != value);
    }

}