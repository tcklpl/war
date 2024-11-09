interface SceneInfoBindGroupOption {
    use: boolean;
    index: number;
}

export class SceneInfoBindGroupOptions {
    private _directionalLights: SceneInfoBindGroupOption = { use: false, index: -1 };
    private _pointLights: SceneInfoBindGroupOption = { use: false, index: -1 };

    private _skybox: SceneInfoBindGroupOption = { use: false, index: -1 };
    private _prefilteredSkybox: SceneInfoBindGroupOption = { use: false, index: -1 };

    private _brdfLUT: SceneInfoBindGroupOption = { use: false, index: -1 };

    private _extras: GPUBindGroupEntry[] = [];

    constructor(private readonly _layoutIndex: number) {}

    includeDirectionalLights(index: number) {
        this._directionalLights = { use: true, index };
        return this;
    }

    includePointLights(index: number) {
        this._pointLights = { use: true, index };
        return this;
    }

    includeSkybox(index: number) {
        this._skybox = { use: true, index };
        return this;
    }

    includePrefilteredSkybox(index: number) {
        this._prefilteredSkybox = { use: true, index };
        return this;
    }

    includeBrdfLUT(index: number) {
        this._brdfLUT = { use: true, index };
        return this;
    }

    includeExtras(extras: GPUBindGroupEntry[]) {
        this._extras = extras;
        return this;
    }

    get layoutIndex() {
        return this._layoutIndex;
    }

    get directionalLights() {
        return this._directionalLights;
    }

    get pointLights() {
        return this._pointLights;
    }

    get skybox() {
        return this._skybox;
    }

    get prefilteredSkybox() {
        return this._prefilteredSkybox;
    }

    get brdfLUT() {
        return this._brdfLUT;
    }

    get extras() {
        return this._extras;
    }
}
