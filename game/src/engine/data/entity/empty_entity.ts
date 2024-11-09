import { identifiable } from '../traits/identifiable';
import { FrameListenerMatrixTransformative } from './frame_listener_matrix_transformative';
import { MatrixTransformative } from './matrix_transformative';

const EntityBase = identifiable(FrameListenerMatrixTransformative);

export class EmptyEntity extends EntityBase {
    private readonly _name: string;

    constructor(data: { name: string }) {
        super();
        this._name = data.name;
    }

    registerChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = this;
            this.children.push(c);
        });
    }

    removeChildren(...children: MatrixTransformative[]) {
        children.forEach(c => {
            c.parent = undefined;
        });
        this.children = this.children.filter(c => !children.find(x => x === c));
    }

    clearChildren() {
        this.removeChildren(...this.children);
    }

    get name() {
        return this._name;
    }
}
