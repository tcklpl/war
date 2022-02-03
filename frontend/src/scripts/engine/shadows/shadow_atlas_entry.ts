import { Mat4 } from "../data_formats/mat/mat4";
import { Vec2 } from "../data_formats/vec/vec2";
import { Vec4 } from "../data_formats/vec/vec4";
import { Light } from "../lights/light";

export class ShadowAtlasEntry {
    
    private _position: Vec2;
    private _size: Vec2;
    private _totalSize: Vec2;
    private _uvMatrix!: Mat4;
    private _relativeLight: Light;

    constructor(position: Vec2, size: Vec2, totalSize: Vec2, light: Light) {
        this._position = position;
        this._size = size;
        this._totalSize = totalSize;
        this._relativeLight = light;
        this.updateUVMatrix();
    }

    private updateUVMatrix() {
        let chunkSizeX = this._totalSize.x / 8;
        let chunkSizeY = this._totalSize.y / 8;
        this._uvMatrix = Mat4.NDCtoUV();
        let xOffset = chunkSizeX * this._position.x;
        let yOffset = chunkSizeY * this._position.y;
        this._uvMatrix.translate(xOffset, yOffset, 0);
        let xScale = chunkSizeX * this._size.x;
        let yScale = chunkSizeY * this._size.y;
        this._uvMatrix.scale(xScale, yScale, 1);
    }

    setTotalSize(size: Vec2) {
        this._totalSize = size;
        this.updateUVMatrix();
    } 

    getAsAbsoluteCoordinates(fullSize: number) {
        let chunkSize = fullSize / 8;
        return new Vec4(this._position.x * chunkSize, this._position.y * chunkSize, this._size.x * chunkSize, this._size.y * chunkSize);
    }

    public get position() {
        return this._position;
    }

    public get size() {
        return this._size;
    }

    public get uvMatrix() {
        return this._uvMatrix;
    }

    public get relativeLight() {
        return this._relativeLight;
    }
}