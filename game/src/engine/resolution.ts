import { Vec2 } from "./data/vec/vec2";

export class Resolution {

    private _full!: Vec2;
    private _half!: Vec2;
    private _quarter!: Vec2;

    constructor(fullRes: Vec2) {
        this.full = fullRes;
        this.updateResolutionChain();
    }

    private updateResolutionChain() {
        this._half = this.getResolutionFromPercentage(50);
        this._quarter = this.getResolutionFromPercentage(25);
    }

    private getResolutionFromPercentage(percentage: number) {
        percentage /= 100;
        const fullPixelCount = this._full.x * this._full.y;
        const newPixelCount = fullPixelCount * percentage;
        const wRatio = this.full.y / this.full.x;
        const hRatio = this.full.x / this.full.y;
        const width = Math.round(Math.sqrt(newPixelCount / wRatio));
        const height = Math.round(Math.sqrt(newPixelCount / hRatio));
        return new Vec2(width, height);
    }

    get full() {
        return this._full;
    }

    set full(fullRes: Vec2) {
        this._full = fullRes;
        this.updateResolutionChain();
    }

    get half() {
        return this._half;
    }

    get quarter() {
        return this._quarter;
    }

}