import { Game } from "../../../game";
import { Mat4 } from "../../data_formats/mat/mat4";
import { Texture } from "../../data_formats/texture";
import { UInteger } from "../../data_formats/uniformable_basics/u_integer";
import { ShaderProgram } from "../shader_program";
import { IShaderProgram } from "./i_shader_program";
import { ILightUniformLocation } from "./light_uniforms";
import { IMvp, IMvpLocation } from "./mvp_uniforms";
import { IShadedUniformLocations, IShadedUniforms } from "./shaded_uniforms";
import { IShadowUniformLocation } from "./shadow_uniforms";
import { IMaterialUniformLocation, IMaterialUniforms } from "./texture_maps_uniforms";

export class ShadedShaderProgram implements IShaderProgram {

    private _shaderUniforms!: IShadedUniforms;
    private _shaderUniformLocations!: IShadedUniformLocations;
    private _shaderProgram: ShaderProgram;

    private _maxLights: number = 8;
    private _maxShadows: number = 64;

    constructor(program: ShaderProgram) {
        this._shaderProgram = program;
        this.fetchUniforms();
        this.instantiatePlaceholder();
    }

    private fetchUniforms() {
        this._shaderProgram.use();
        let mvp: IMvpLocation = {
            model: this._shaderProgram.getUniform('u_model'),
            view: this._shaderProgram.getUniform('u_view'),
            projection: this._shaderProgram.getUniform('u_projection')
        }
        let lights: ILightUniformLocation[] = [];
        for (let i = 0 ; i < this._maxLights; i++) {
            lights.push({
                reverseLightDirection: this._shaderProgram.getUniform(`u_lights[${i}].reverse_light_direction`),
                color: this._shaderProgram.getUniform(`u_lights[${i}].color`),
                position: this._shaderProgram.getUniform(`u_lights[${i}].position`),
                intensity: this._shaderProgram.getUniform(`u_lights[${i}].intensity`),
            });
        }
        let presentLights = this._shaderProgram.getUniform('u_present_lights');
        let shadowAtlas = this._shaderProgram.getUniform('u_shadow_atlas');
        let material: IMaterialUniformLocation = {
            albedo: this._shaderProgram.getUniform('u_map_albedo'),
            normal: this._shaderProgram.getUniform('u_map_normal')
        }
        let shadows: IShadowUniformLocation[] = [];
        for (let i = 0; i < this._maxShadows; i++) {
            shadows.push({
                position: this._shaderProgram.getUniform(`u_shadows[${i}].position`),
                textureMat: this._shaderProgram.getUniform(`u_shadows[${i}].texture_matrix`),
            });
        }
        let presentShadows = this._shaderProgram.getUniform('u_present_shadows');

        this._shaderUniformLocations = {
            vertex: {
                mvp: mvp
            },
            fragment: {
                lights: lights,
                material: material,
                presentLights: presentLights,
                shadowAtlas: shadowAtlas
            },
            shared: {
                shadows: shadows,
                presentShadows: presentShadows
            }
        }
    }

    private instantiatePlaceholder() {
        let mvp: IMvp = {
            model: Mat4.identity(),
            view: Mat4.identity(),
            projection: Mat4.identity()
        };
        let shadowAtlas = Texture.placeholder();
        let material: IMaterialUniforms = {
            albedo: Texture.placeholder(),
            normal: Texture.placeholder()
        }
        this._shaderUniforms = {
            vertex: {
                mvp: mvp
            },
            fragment: {
                lights: [],
                material: material,
                presentLights: new UInteger(0),
                shadowAtlas: shadowAtlas
            },
            shared: {
                shadows: [],
                presentShadows: new UInteger(0)
            }
        }
    }
    
    bindUniforms() {
        if (!this._shaderUniforms) throw `Failed to bind undefined uniforms`;
        let gl = Game.instance.gl;
        this._shaderUniforms.vertex.mvp.model.setUniform(gl, this._shaderUniformLocations.vertex.mvp.model);
        this._shaderUniforms.vertex.mvp.view.setUniform(gl, this._shaderUniformLocations.vertex.mvp.view);
        this._shaderUniforms.vertex.mvp.projection.setUniform(gl, this._shaderUniformLocations.vertex.mvp.projection);

        for (let i = 0; i < this._shaderUniforms.fragment.lights.length; i++) {
            this._shaderUniforms.fragment.lights[i].reverseLightDirection.setUniform(gl, this._shaderUniformLocations.fragment.lights[i].reverseLightDirection);
            this._shaderUniforms.fragment.lights[i].color.setUniform(gl, this._shaderUniformLocations.fragment.lights[i].color);
            this._shaderUniforms.fragment.lights[i].position.setUniform(gl, this._shaderUniformLocations.fragment.lights[i].position);
            this._shaderUniforms.fragment.lights[i].intensity.setUniform(gl, this._shaderUniformLocations.fragment.lights[i].intensity);
        }

        this._shaderUniforms.fragment.material.albedo.setUniform(gl, this._shaderUniformLocations.fragment.material.albedo);
        this._shaderUniforms.fragment.material.normal.setUniform(gl, this._shaderUniformLocations.fragment.material.normal);

        this._shaderUniforms.fragment.presentLights.setUniform(gl, this._shaderUniformLocations.fragment.presentLights);
        this._shaderUniforms.fragment.shadowAtlas.setUniform(gl, this._shaderUniformLocations.fragment.shadowAtlas);

        for (let i = 0; i < this._shaderUniforms.shared.shadows.length; i++) {
            this._shaderUniforms.shared.shadows[i].position.setUniform(gl, this._shaderUniformLocations.shared.shadows[i].position);
            this._shaderUniforms.shared.shadows[i].textureMat.setUniform(gl, this._shaderUniformLocations.shared.shadows[i].textureMat);
        }

        this._shaderUniforms.shared.presentShadows.setUniform(gl, this._shaderUniformLocations.shared.presentShadows);
    }

    public get uniforms() {
        return this._shaderUniforms;
    }

    public get program() {
        return this._shaderProgram;
    }


}