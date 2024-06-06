import { GLTFAnimationChannelTargetPath } from 'gltf';
import { GLTFNode } from './gltf_node';

export class GLTFAnimationChannelTarget {
    constructor(
        private _node: GLTFNode,
        private _path: GLTFAnimationChannelTargetPath,
    ) {}

    get node() {
        return this._node;
    }

    get path() {
        return this._path;
    }
}
