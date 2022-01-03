import { InteractableObject } from "../../engine/objects/interactable_object";
import { Game } from "../../game";

export class Country {

    private _code: string;
    private name: string;
    private countryParts: InteractableObject[] = [];

    constructor(code: string, name: string, parts: string[]) {
        this._code = code;
        this.name = name;
        parts.forEach(p => {
            let obj = Game.instance.objectHolder.getObjectByName(p);
            if (!obj) throw `Failed to load country '${name}': Object not found: '${p}'`;
            let iobj = new InteractableObject(obj);
            iobj.onHover = () => this.onHover();
            iobj.onMouseLeave = () => this.onMouseLeave();
            iobj.onClick = () => this.onClick();
            this.countryParts.push(iobj);
        });
    }

    onHover() {
        console.log(`hovered over ${this.name}`);
    }

    onMouseLeave() {
        console.log(`mouse left ${this.name}`);
    }

    onClick() {
        console.log(`clicked on ${this.name}`);
    }

    public get code() {
        return this._code;
    }

    public get parts() {
        return this.countryParts;
    }
}