import { BadGLTFFileError } from "../../../errors/engine/gltf/bad_gltf_file";
import { UnsupportedGLTFFeatureError } from "../../../errors/engine/gltf/unsupported_gltf_feature";
import { LookAtCamera } from "../../camera/lookat_camera";
import { Entity } from "../../entity/entity";
import { Quaternion } from "../quaternion/quaternion";
import { Vec3 } from "../vec/vec3";
import { GLTFCamera } from "./gltf_camera";
import { GLTFLight } from "./gltf_light";
import { GLTFMesh } from "./gltf_mesh";

export type GLTFNodeType = 'mesh' | 'camera' | 'light';

export abstract class GLTFNode {

    private _name: string;
    private _rotation: number[]; //quaternion
    private _translation: number[]; // vec3

    constructor(name: string, rotation: number[], translation: number[]) {

        if (rotation.length !== 4)
            throw new BadGLTFFileError(`Invalid node rotation quaternion of length ${rotation.length} for node '${name}'`);

        this._name = name;
        this._rotation = rotation;
        this._translation = translation;
    }

    get name() {
        return this._name;
    }

    get rotation() {
        return this._rotation;
    }

    get translation() {
        return this._translation;
    }

    abstract get nodeType(): GLTFNodeType;

}

export class GLTFNodeMesh extends GLTFNode {

    private _mesh: GLTFMesh;

    constructor(name: string, rotation: number[], translation: number[], mesh: GLTFMesh) {
        super(name, rotation, translation);
        this._mesh = mesh;
    }

    get mesh() {
        return this._mesh;
    }

    get nodeType(): GLTFNodeType {
        return 'mesh';
    }

    constructEntity() {
        const mesh = this.mesh.constructEngineMesh();
        const entity = new Entity({ name: this.name, mesh: mesh });
        entity.translation = new Vec3(this.translation[0], this.translation[1], this.translation[2]);
        entity.rotationQuaternion = new Quaternion(this.rotation[0], this.rotation[1], this.rotation[2], this.rotation[3]);
        return entity;
    }

}

export class GLTFNodeCamera extends GLTFNode {

    private _camera: GLTFCamera;

    constructor(name: string, rotation: number[], translation: number[], camera: GLTFCamera) {
        super(name, rotation, translation);
        this._camera = camera;
    }

    get camera() {
        return this._camera;
    }

    get nodeType(): GLTFNodeType {
        return 'camera';
    }

    constructEngineCamera() {
        const position = new Vec3(this.translation[0], this.translation[1], this.translation[2]);
        // this should work as the target will be the position + the rotation quaternion point
        const target = new Vec3(this.translation[0], this.translation[1], this.translation[2]).add(new Vec3(this.rotation[0], this.rotation[1], this.rotation[2]));
        switch (this.camera.type) {
            case 'perspective':
                return new LookAtCamera(position, Vec3.UP, target);
            case 'orthographic':
                throw new UnsupportedGLTFFeatureError('Orthographic cameras are not yet supported');
        }
    }

}

export class GLTFNodeLight extends GLTFNode {

    private _light: GLTFLight;

    constructor(name: string, rotation: number[], translation: number[], light: GLTFLight) {
        super(name, rotation, translation);
        this._light = light;
    }

    get light() {
        return this._light;
    }

    get nodeType(): GLTFNodeType {
        return 'light';
    }

}