import { Game } from "../../game";
import { Mat4 } from "../data_formats/mat/mat4";
import { UBoolean } from "../data_formats/uniformable_basics/u_boolean";
import { UFloat } from "../data_formats/uniformable_basics/u_float";
import { Vec3 } from "../data_formats/vec/vec3";
import { Vec4 } from "../data_formats/vec/vec4";
import { ShaderLightUniformLocations } from "../shaders/shader_light_info";
import { ILightCreationInfo } from "./light_creation_info";

export abstract class Light {

    protected _info: ILightCreationInfo;

    private color: Vec4;

    private worldMatrix!: Mat4;
    private inverseWorldMat!: Mat4;
    protected projectionMatrix!: Mat4;
    private _reverseDirection!: Vec3;

    private _depthMat!: Mat4;
    private gl = Game.instance.gl;

    constructor(info: ILightCreationInfo) {
        this._info = info;
        this.color = new Vec4(info.color.x, info.color.y, info.color.z, 1);
        this.generateWorldMatrices();
    }

    protected postConstruct() {
        if (this._info.castsShadows) {
            this.generateDepthTextureMatrix();
        }
    }

    generateWorldMatrices() {
        this.worldMatrix = Mat4.lookAt(this._info.position, this._info.target, this._info.up);
        this.inverseWorldMat = Mat4.inverse(this.worldMat4);
        let sliced = this.worldMat4.values.slice(8, 11);
        this._reverseDirection = new Vec3(sliced[0], sliced[1], sliced[2]);
    }

    abstract generateProjectionMatrix(): void;

    bind(location: ShaderLightUniformLocations) {
        if (!location) throw `Failed to bind light uniforms: null location`;
        this.color.setUniform(this.gl, location.color);
        this._info.position.setUniform(this.gl, location.position);
        new UFloat(this._info.intensity).setUniform(this.gl, location.intensity);

        new UBoolean(this._info.castsShadows).setUniform(this.gl, location.castsShadows);

        if (this._info.castsShadows) {
            // new Texture(this._depthTexture, 2).setUniform(this.gl, location.shadowMap);
            this._reverseDirection.setUniform(this.gl, location.reverseLightDirection);
            this._depthMat.setUniform(this.gl, location.shadowMapTexMat);
        }
    }

    private generateDepthTextureMatrix() {
        this._depthMat = Mat4.identity();

        // the original is in [-1, 1], so we divide it by 2 and move it up .5 to be in [0, 1]
        this._depthMat.translate(0.5, 0.5, 0.5);
        this._depthMat.scale(0.5, 0.5, 0.5);

        // now remap to the actual shadow position in the shadow atlas
        

        this._depthMat.multiplyBy(this.projectionMatrix);
        this._depthMat.multiplyBy(this.inverseWorldMat);
    }

    public get name() {
        return this._info.name;
    }

    public get worldMat4() {
        return this.worldMatrix;
    }

    public get inverseWorldMat4() {
        return this.inverseWorldMat;
    }

    public get projectionMat4() {
        return this.projectionMatrix;
    }

    public get depthTextureMat4() {
        return this._depthMat;
    }

    public get reverseDirection() {
        return this._reverseDirection;
    }

    public get active() {
        return this._info.enabled;
    }

    public get info() {
        return this._info;
    }

}