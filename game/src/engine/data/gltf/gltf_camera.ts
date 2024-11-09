import { GLTFCameraTypes } from 'gltf';
import { BadGLTFFileError } from '../../../errors/engine/gltf/bad_gltf_file';
import { InvalidGLTFProperty } from '../../../errors/engine/gltf/invalid_gltf_property';

interface GLTFCameraConstructorOptionalArgs {
    aspectRatio?: number;
    yfov?: number;

    xmag?: number;
    ymag?: number;
}

export class GLTFCamera {
    private readonly _name: string;
    private readonly _type: GLTFCameraTypes;

    private readonly _znear: number;
    private readonly _zfar: number;

    // perspective
    private readonly _aspectRatio?: number;
    private readonly _yfov?: number;

    // orthographic
    private readonly _xmag?: number;
    private readonly _ymag?: number;

    constructor(
        name: string,
        type: GLTFCameraTypes,
        znear: number,
        zfar: number,
        specific: GLTFCameraConstructorOptionalArgs,
    ) {
        this._name = name;
        this._type = type;
        this._znear = znear;
        this._zfar = zfar;

        switch (type) {
            case 'perspective':
                if (!specific.aspectRatio || !specific.yfov)
                    throw new BadGLTFFileError(
                        'Perspective camera is missing either aspect ratio or yfov properties (or both)',
                    );
                this._aspectRatio = specific.aspectRatio;
                this._yfov = specific.yfov;
                break;
            case 'orthographic':
                if (!specific.xmag || !specific.ymag)
                    throw new BadGLTFFileError(
                        'Orthographic camera is missing either xmag or ymag properties (or both)',
                    );
                this._xmag = specific.xmag;
                this._ymag = specific.ymag;
                break;
        }
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get znear() {
        return this._znear;
    }

    get zfar() {
        return this._zfar;
    }

    get aspectRatio(): number {
        if (this.type !== 'perspective')
            throw new InvalidGLTFProperty('Trying to access aspectRatio of a non-perspective camera');
        return this._aspectRatio as number;
    }

    get yfov(): number {
        if (this.type !== 'perspective')
            throw new InvalidGLTFProperty('Trying to access yfov of a non-perspective camera');
        return this._yfov as number;
    }

    get xmag(): number {
        if (this.type !== 'orthographic')
            throw new InvalidGLTFProperty('Trying to access xmag of a non-orthographic camera');
        return this._xmag as number;
    }

    get ymag(): number {
        if (this.type !== 'orthographic')
            throw new InvalidGLTFProperty('Trying to access ymag of a non-orthographic camera');
        return this._ymag as number;
    }
}
