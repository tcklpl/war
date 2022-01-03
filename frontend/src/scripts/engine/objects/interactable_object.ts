import { Game3DObject } from "./game3d_obj";

export class InteractableObject {

    private g3dobj: Game3DObject;

    constructor(obj: Game3DObject) {
        this.g3dobj = obj;
    }

    onHover?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;

    public get id() {
        return this.g3dobj.id;
    }

    public get obj() {
        return this.g3dobj;
    }

}