import { GLTFNode, GLTFNodeCamera, GLTFNodeLight, GLTFNodeMesh } from './gltf_node';

export class GLTFScene {
    private readonly _name: string;
    private readonly _nodes: GLTFNode[];

    constructor(name: string, nodes: GLTFNode[]) {
        this._name = name;
        this._nodes = nodes;
    }

    get name() {
        return this._name;
    }

    get nodes() {
        return this._nodes;
    }

    get meshes(): GLTFNodeMesh[] {
        return this._nodes.filter(x => x instanceof GLTFNodeMesh);
    }

    get cameras(): GLTFNodeCamera[] {
        return this._nodes.filter(x => x instanceof GLTFNodeCamera);
    }

    get lights(): GLTFNodeLight[] {
        return this._nodes.filter(x => x instanceof GLTFNodeLight);
    }
}
