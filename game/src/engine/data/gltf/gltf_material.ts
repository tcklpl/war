import { PBRMaterial } from '../material/pbr_material';
import { Vec4 } from '../vec/vec4';

interface GLTFMaterialProperties {
    doubleSided: boolean;
    baseColor: number[];
    metallic: number;
    roughness: number;
    ior?: number;
    specular?: number[];
    transmission?: number;
}

export class GLTFMaterial {
    private readonly _name: string;
    private readonly _doubleSided: boolean;

    private readonly _baseColor: number[]; //vec4
    private readonly _metallic: number;
    private readonly _roughness: number;
    private readonly _ior: number;
    private readonly _specular: number[];
    private readonly _transmission: number;

    private _pbrMaterial?: PBRMaterial;

    constructor(name: string, properties: GLTFMaterialProperties) {
        this._name = name;
        this._doubleSided = properties.doubleSided;
        this._baseColor = properties.baseColor;
        this._metallic = properties.metallic;
        this._roughness = properties.roughness;
        this._ior = properties.ior ?? 1.3;
        this._specular = properties.specular ?? [0.5, 0.5, 0.5];
        this._transmission = properties.transmission ?? 0;
    }

    private constructPBRMaterial() {
        this._pbrMaterial = new PBRMaterial(this._name, {
            baseColor: Vec4.fromArray(this._baseColor),
            metallic: this._metallic,
            roughness: this._roughness,
            ior: this._ior,
        });
    }

    get asEnginePBRMaterial(): PBRMaterial {
        if (!this._pbrMaterial) this.constructPBRMaterial();
        return this._pbrMaterial as PBRMaterial;
    }
}
