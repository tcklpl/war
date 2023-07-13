
export abstract class Material {
    
    constructor(private _name: string) {
    }

    get name() {
        return this._name;
    }
}