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

    constructPBRMaterial() {
        return new PBRMaterial(this._name);
        // return new PBRShader(this._name, {
        //     baseColor: new Vec4(this._baseColor[0], this._baseColor[1], this._baseColor[2], this._baseColor[3]),
        //     metallic: this._metallic,
        //     roughness: this._roughness,
        //     ior: this._ior,
        //     specularColor: new Vec3(this._specular[0], this._specular[1], this._specular[2]),
        //     transmission: this._transmission
        // });
    }
}
