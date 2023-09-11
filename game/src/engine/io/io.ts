import { InteractableManager } from "./interaction/interactable_manager";
import { MouseInteractionManager } from "./interaction/mouse_interaction_manager";
import { Keyboard } from "./keyboard";
import { Mouse } from "./mouse";

export class GameIO {

    private _mouse = new Mouse();
    private _keyboard = new Keyboard();

    private _interactableManager = new InteractableManager();
    private _mouseInteractionManager = new MouseInteractionManager(this._mouse);

    get mouse() {
        return this._mouse;
    }

    get keyboard() {
        return this._keyboard;
    }

    get interactionManager() {
        return this._interactableManager;
    }

    get mouseInteractionManager() {
        return this._mouseInteractionManager;
    }

}