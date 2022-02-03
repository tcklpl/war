import { ShaderProgram } from "../shaders/shader_program";
import { ShadowMapAtlas } from "../shadows/shadow_atlas";
import { Light } from "./light";

export class LightManager {

    private _lights: Light[] = [];
    private _shadowAtlas = new ShadowMapAtlas();

    constructor() {
        //TODO: specify texture size
        this._shadowAtlas.constructTexture();
    }

    registerLight(light: Light) {
        this._lights.push(light);
    }

    getByName(name: string) {
        return this._lights.find(x => x.name == name);
    }

    public get activeLights() {
        return this._lights.filter(x => x.active);
    }

    public get allLights() {
        return this._lights;
    }

    public get shadowAtlas() {
        return this._shadowAtlas;
    }

}