import type { GLTFAnimationChannelTargetPath } from 'gltf';
import type { GLTFNode } from './gltf-node';

export class GLTFAnimationChannelTarget {
	constructor(
		private readonly _node: GLTFNode,
		private readonly _path: GLTFAnimationChannelTargetPath,
	) {}

	get node() {
		return this._node;
	}

	get path() {
		return this._path;
	}
}
