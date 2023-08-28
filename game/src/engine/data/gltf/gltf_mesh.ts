import { Mesh } from "../meshes/mesh";
import { Primitive } from "../meshes/primitive";
import { GLTFMeshPrimitive } from "./gltf_mesh_primitive";

export class GLTFMesh {

    private _name: string;
    private _primitives: GLTFMeshPrimitive[];

    private _engineMesh?: Mesh;

    constructor(name: string, primitives: GLTFMeshPrimitive[]) {
        this._name = name;
        this._primitives = primitives;
    }

    get name() {
        return this._name;
    }

    get primitives() {
        return this._primitives;
    }

    private constructEngineMesh() {

        const constructedPrimitives: Primitive[] = [];
        this._primitives.forEach(p => {
            
            const positionsBuffer = p.attributes.POSITION.bufferView.buildBuffer();
            const uvBuffer = p.attributes.TEXCOORD_0.bufferView.buildBuffer();
            const normalBuffer = p.attributes.NORMAL.bufferView.buildBuffer();
            const tangentBuffer = p.attributes.TANGENT.bufferView.buildBuffer();
            const indicesBuffer = p.indices.bufferView.buildBuffer();

            constructedPrimitives.push(new Primitive({
                positions: positionsBuffer,
                uv: uvBuffer,
                normals: normalBuffer,
                tangent: tangentBuffer,
                indices: indicesBuffer
            }, p.indices.count, p.material.asEnginePBRMaterial));
        });

        this._engineMesh = new Mesh(this._name, constructedPrimitives);
    }

    get asEngineMesh() {
        if (!this._engineMesh) this.constructEngineMesh();
        return this._engineMesh as Mesh;
    }

}