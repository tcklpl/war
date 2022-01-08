import { Game } from "../game";
import { InteractableObject } from "./objects/interactable_object";
import { IMouseListener } from "./traits/mouse_listener";

export class ObjectInteractionManager implements IMouseListener {

    private interactables: InteractableObject[] = [];
    private idUnderMouse: number = -1;
    private interactableUnderMouse?: InteractableObject;

    constructor() {
        Game.instance.mouse.registerMouseListener(this);
    }

    registerInteractableObject(io: InteractableObject) {
        this.interactables.push(io);
    }

    changeIdUnderMouse(newId: number) {
        if (newId < 0) {
            this.idUnderMouse = -1;
            if (this.interactableUnderMouse?.onMouseLeave) this.interactableUnderMouse.onMouseLeave();
            this.interactableUnderMouse = undefined;
            return;
        }
        if (this.idUnderMouse !== newId) {
            let newHovered = this.interactables.find(x => x.id === newId) as InteractableObject;
            
            if (newHovered.onHover) newHovered.onHover();
            if (this.interactableUnderMouse?.onMouseLeave) this.interactableUnderMouse.onMouseLeave();

            this.interactableUnderMouse = newHovered;
        }
        this.idUnderMouse = newId;
    }

    onMouseLeftClick() {
        if (this.interactableUnderMouse?.onClick) this.interactableUnderMouse.onClick();
    }


    
}