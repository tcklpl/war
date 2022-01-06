import { Animation } from "../../engine/animations/animation";
import { Vec3 } from "../../engine/data_formats/vec/vec3";
import { InteractableObject } from "../../engine/objects/interactable_object";
import { Game } from "../../game";

export class Country {

    private _code: string;
    private name: string;
    private countryParts: InteractableObject[] = [];

    private fixedPosition: boolean = false;

    private hoverAnimation: Animation;
    private hoverAnimationIds?: number[];

    private clickAnimation: Animation;
    private clickAnimationIds?: number[];

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
        this.hoverAnimation = Game.instance.animations.getAnimation('country_hover') as Animation;
        this.clickAnimation = Game.instance.animations.getAnimation('country_click') as Animation;
    }

    onHover() {
        if (this.fixed) return;
        this.hoverAnimationIds = [];
        this.countryParts.forEach(cp => {
            let aid = Game.instance.animations.playAnimation(cp.obj, this.hoverAnimation, () => this.hoverAnimationIds = undefined);
            this.hoverAnimationIds?.push(aid);
        });
    }

    onMouseLeave() {
        if (this.fixed) return;
        if (this.hoverAnimationIds) {
            this.hoverAnimationIds.forEach(id => {
                Game.instance.animations.stopAnimation(id);
            });
        }
        this.hoverAnimationIds = undefined;
        this.countryParts.forEach(cp => {
            cp.obj.setTranslation(new Vec3(0, 0, 0));
        });
    }

    onClick() {
        Game.instance.board.selected = this;
    }

    onBoardSelection() {
        this.countryParts.forEach(cp => {
            let aid = Game.instance.animations.playAnimation(cp.obj, this.clickAnimation);
        });
    }

    resetPosition() {
        this.countryParts.forEach(cp => {
            cp.obj.setDefaultTransformations();
        });
    }

    public get code() {
        return this._code;
    }

    public get parts() {
        return this.countryParts;
    }

    public get fixed() {
        return this.fixedPosition;
    }

    public set fixed(value: boolean) {
        this.fixedPosition = value;
    }
}