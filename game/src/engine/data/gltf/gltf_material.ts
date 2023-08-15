import { PBRShader } from "../../../shaders/pbr/pbr_shader";
import { PBRMaterial } from "../material/pbr_material";
import { Vec3 } from "../vec/vec3";
import { Vec4 } from "../vec/vec4";

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

    private _name: string;
    private _doubleSided: boolean;
    
    private _baseColor: number[]; //vec4
    private _metallic: number;
    private _roughness: number;
    private _ior: number;
    private _specular: number[];
    private _transmission: number;

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
            ior: this._ior
        });

    }

    get asEnginePBRMaterial(): PBRMaterial {
        if (!this._pbrMaterial) this.constructPBRMaterial();
        return this._pbrMaterial as PBRMaterial;
    }
}
