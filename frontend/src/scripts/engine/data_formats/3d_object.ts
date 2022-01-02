import { Game } from "../../game";
import { Vec2 } from "./vec/vec2";
import { Vec3 } from "./vec/vec3";

export enum I3DMap {
    ALBEDO, NORMAL
}

export interface Vertex {
    position: Vec3;
    uv: Vec2;
    normal: Vec3;
}

export class I3DObject {
    
    name: string;
    vertices: Vertex[] = [];
    private gl = Game.instance.getGL();

    private bufferPosic: WebGLBuffer;
    private bufferUV: WebGLBuffer;
    private bufferNormal: WebGLBuffer;
    private bufferIndex: WebGLBuffer;

    private vao: WebGLVertexArrayObject;
    private vaoSize: number;

    constructor(name: string, vertices: Vec3[], uvs: Vec2[], normals: Vec3[], indices: Vec3[]) {
        if (!name || !vertices || !uvs || !normals || !indices) throw `Trying to create 3d object with insufficient args`;
        this.name = name;

        indices.forEach((indexGroup) => {
            this.vertices.push({
                position: vertices[indexGroup.x - 1],
                uv: uvs[indexGroup.y - 1],
                normal: normals[indexGroup.z - 1]
            });
        });

        let bufferPosic: WebGLBuffer | null = null;
        let bufferUV: WebGLBuffer | null = null;
        let bufferNormal: WebGLBuffer | null = null;
        let bufferIndex: WebGLBuffer | null = null;
        
        // create vertex coordinate buffer
        bufferPosic = this.gl.createBuffer();
        if (!bufferPosic) throw `Failed to allocate posic buffer when creating '${name}'`;
        this.bufferPosic = bufferPosic;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferPosic);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices.map(v => [v.position.x, v.position.y, v.position.z]).flat(1)), this.gl.STATIC_DRAW);

        // create UV coordinate buffer
        bufferUV = this.gl.createBuffer();
        if (!bufferUV) throw `Failed to allocate uv buffer when creating '${name}'`;
        this.bufferUV = bufferUV;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferUV);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices.map(v => [v.uv.x, v.uv.y]).flat(1)), this.gl.STATIC_DRAW);

        // create normal buffer
        bufferNormal = this.gl.createBuffer();
        if (!bufferNormal) throw `Failed to allocate normal buffer when creating '${name}'`;
        this.bufferNormal = bufferNormal;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferNormal);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices.map(v => [v.normal.x, v.normal.y, v.normal.z]).flat(1)), this.gl.STATIC_DRAW);

        // create vao
        let vao = this.gl.createVertexArray();
        if (!vao) throw `Failed to create VAO when creating '${name}'`;
        this.vao = vao;
        this.gl.bindVertexArray(this.vao);

        // bind vertex coordinates to vao
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferPosic);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        // bind uv coordinates to vao
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferUV);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(1);

        // bind normal coordinated to vao
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferNormal);
        this.gl.vertexAttribPointer(2, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(2);

        // create index buffer
        bufferIndex = this.gl.createBuffer();
        if (!bufferIndex) throw `Failed to allocate index buffer when creating '${name}'`;
        this.bufferIndex = bufferIndex;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndex);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices.map(v => [v.x, v.y, v.z]).flat(1)), this.gl.STATIC_DRAW);

        this.vaoSize = this.gl.getBufferParameter(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.BUFFER_SIZE);
    }

    bindVAO() {
        this.gl.bindVertexArray(this.vao);
    }

    draw() {
        this.gl.bindVertexArray(this.vao);
        //this.gl.drawElements(this.gl.TRIANGLES, this.vaoSize, this.gl.UNSIGNED_SHORT, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vaoSize / 3);
    }
}