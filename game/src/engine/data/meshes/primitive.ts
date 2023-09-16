import { BindDeletedMeshPrimitiveError } from "../../../errors/engine/data/bind_deleted_mesh_primitive";
import { Material } from "../material/material";
import { PrimitiveDrawOptions } from "./primitive_draw_options";

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

    draw(passEncoder: GPURenderPassEncoder, pipeline: GPURenderPipeline, options: PrimitiveDrawOptions) {
        if (!this._available) throw new BindDeletedMeshPrimitiveError();
        
        if (options.useMaterial) this._material.bind(passEncoder, pipeline);
        
        if (options.position.use) passEncoder.setVertexBuffer(options.position.index, this._buffers.positions);
        if (options.uv.use) passEncoder.setVertexBuffer(options.uv.index, this._buffers.uv);
        if (options.normal.use) passEncoder.setVertexBuffer(options.normal.index, this._buffers.normals);
        if (options.tangent.use) passEncoder.setVertexBuffer(options.tangent.index, this._buffers.tangent);
        passEncoder.setIndexBuffer(this._buffers.indices, 'uint16');
        passEncoder.drawIndexed(this._indicesSize);
    }

    free() {
        this._buffers.positions.destroy();
        this._buffers.uv.destroy();
        this._buffers.normals.destroy();
        this._buffers.tangent.destroy();
        this._buffers.indices.destroy();
        this._available = false;
    }

}