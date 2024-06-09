import { Vec2 } from '../vec/vec2';
import { AtlasTreeNode } from './atlas_tree';

export class MappedAtlasRegion {
    private _size: Vec2;

    constructor(
        public lowerCorner: Vec2,
        public higherCorner: Vec2,
        public uvLowerCorner: Vec2,
        public uvHigherCorner: Vec2,
        private _treeNode: AtlasTreeNode,
    ) {
        this._size = new Vec2(higherCorner.x - lowerCorner.x, higherCorner.y - lowerCorner.y);
    }

    get treeNode() {
        return this._treeNode;
    }

    get size() {
        return this._size;
    }
}
