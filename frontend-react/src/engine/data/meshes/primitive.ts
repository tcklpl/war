import { BindDeletedMeshPrimitiveError } from "../../../errors/engine/data/bind_deleted_mesh_primitive";
import { Shader } from "../../../shaders/shader";
import { Material } from "../material/material";

type PrimitiveBuffers = {
    positions: GPUBuffer;
    uv: GPUBuffer;
    normals: GPUBuffer;
    tangent: GPUBuffer;
    indices: GPUBuffer;
}

export class Primitive {

    private _indicesSize: number;
    private _buffers: PrimitiveBuffers;
    private _available = true;
    private _material: Material;

    constructor(buffers: PrimitiveBuffers, indicesSize: number, material: Material) {
        this._indicesSize = indicesSize;
        this._buffers = buffers;
        this._material = material;
    }

    draw(passEncoder: GPURenderPassEncoder) {
        if (!this._available) throw new BindDeletedMeshPrimitiveError();
        // TODO: bind material
        
        passEncoder.setVertexBuffer(0, this._buffers.positions);
        passEncoder.setVertexBuffer(1, this._buffers.uv);
        passEncoder.setVertexBuffer(2, this._buffers.normals);
        passEncoder.setVertexBuffer(3, this._buffers.tangent);
        passEncoder.setIndexBuffer(this._buffers.indices, 'uint16');
        passEncoder.drawIndexed(this._indicesSize);
    }

    delete() {
        this._buffers.positions.destroy();
        this._buffers.uv.destroy();
        this._buffers.normals.destroy();
        this._buffers.tangent.destroy();
        this._buffers.indices.destroy();
        this._available = false;
    }

}