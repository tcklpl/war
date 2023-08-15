import { identifiable } from "../data/traits/identifiable";
import { MatrixTransformative } from "./matrix_transformative";


const EntityBase = identifiable(MatrixTransformative);

export class EmptyEntity extends EntityBase {

    private _children: MatrixTransformative[] = [];

    private _name: string;
    

    constructor(data: {name: string}) {
        super();
        this._name = data.name;
    }

    registerChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = this;
            this._children.push(c);
        });
    }

    removeChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = undefined;
        });
        this._children = this._children.filter(c => !children.find(x => x === c));
    }

    clearChildren() {
        this.removeChildren(...this._children);
    }

    get name() {
        return this._name;
    }

    get children() {
        return this._children;
    }
}