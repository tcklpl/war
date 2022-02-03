import { Game } from "../../game";
import { Mat4 } from "../data_formats/mat/mat4";
import { Vec4 } from "../data_formats/vec/vec4";
import { ShaderUtils } from "../engine_shader_utils";
import { MaterialLocation } from "../material";
import { IUniformable } from "../traits/uniformable";
import { ShaderLightUniformLocations } from "./shader_light_info";

export class ShaderProgram {

    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private attributes: Map<string, number> = new Map();
    private uniforms: Map<string, WebGLUniformLocation> = new Map();
    private name: string;

    private materialLocation?: MaterialLocation;
    private lights: ShaderLightUniformLocations[] = [];

    constructor(name: string, vert: string, frag: string) {
        if (!vert || !frag) throw "Failed to create shader program with empty vert or frag source";
        this.gl = Game.instance.gl;

        this.name = name;
        
        this.program = ShaderUtils.createProgram(this.gl, vert, frag);
        this.gl.useProgram(this.program);

        let vertSourceWords = vert.split('\n').filter(l => l.startsWith('uniform ')).join(' ').split(' ');
        vertSourceWords.filter(x => x.startsWith('a_')).forEach(x => this.attributes.set(x, this.gl.getAttribLocation(this.program, x)));
        vertSourceWords.filter(x => x.startsWith('u_')).forEach(x => {
            let name = x.replace(/[^a-zA-Z_]/g, '');
            console.log(`'${x}' => '${name}'`);
            let location = this.gl.getUniformLocation(this.program, name);
            if (location)
                this.uniforms.set(name, location);
        });

        let fragSourceWords = frag.split('\n').filter(l => l.startsWith('uniform ')).join(' ').split(' ');
        fragSourceWords.filter(x => x.startsWith('a_')).forEach(x => this.attributes.set(x, this.gl.getAttribLocation(this.program, x)));
        fragSourceWords.filter(x => x.startsWith('u_')).forEach(x => {
            let name = x.replace(/[^a-zA-Z_]/g, '');
            console.log(`'${x}' => '${name}'`);
            let location = this.gl.getUniformLocation(this.program, name);
            if (location)
                this.uniforms.set(name, location);
        });

        this.tryToGetMaterialUniforms();

        //if (this.uniforms.has('u_lights'))
        this.getLightUniforms();
    }

    private tryToGetMaterialUniforms() {
        let albedo = this.uniforms.get('u_map_albedo');
        let normal = this.uniforms.get('u_map_normal');
        if (albedo && normal) {
            this.materialLocation = {
                albedo: albedo,
                normal: normal
            }
        }
    }

    private getLightUniforms() {
        // TODO: actual number of lights
        for (let i = 0; i < 3; i++) {
            this.lights.push({
                shadowMap: this.gl.getUniformLocation(this.program, `u_lights[${i}].shadow_map`) as WebGLUniformLocation,
                reverseLightDirection: this.gl.getUniformLocation(this.program, `u_lights[${i}].reverse_light_direction`) as WebGLUniformLocation,
                color: this.gl.getUniformLocation(this.program, `u_lights[${i}].color`) as WebGLUniformLocation,
                position: this.gl.getUniformLocation(this.program, `u_lights[${i}].position`) as WebGLUniformLocation,
                castsShadows: this.gl.getUniformLocation(this.program, `u_lights[${i}].casts_shadows`) as WebGLUniformLocation,
                intensity: this.gl.getUniformLocation(this.program, `u_lights[${i}].intensity`) as WebGLUniformLocation,
                shadowMapTexMat: this.gl.getUniformLocation(this.program, `u_lights[${i}].texture_matrix`) as WebGLUniformLocation,
            });
        }
    }

    hasMaterialUniforms() {
        return this.materialLocation != undefined;
    }

    public get materialUniforms() {
        return this.materialLocation;
    }

    public get lightUniforms() {
        return this.lights;
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniforms(uniforms: Map<string, IUniformable>) {
        uniforms.forEach((value, key) => {
            let location = this.uniforms.get(key);
            if (location) {
                this.gl.useProgram(this.program);
                value.setUniform(this.gl, location);
            } else {
                console.warn(`uniform ${key} not found`)
            }
        });
    }

    getUniform(name: string) {
        let response = this.gl.getUniformLocation(this.program, name);
        if (!response) throw `Could not get uniform ${name}`;
        return response;
    }

    setUniformMat4f(uniform: string, value: Mat4, ignoreErrors: boolean = false) {
        if (!this.uniforms.has(uniform)) {
            if (ignoreErrors) return;    
            throw `Cannot get uniform ${uniform}`;
        }
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.uniforms.get(uniform) as WebGLUniformLocation, false, new Float32Array(value.values), 0);
    }

    setUniformVec4(uniform: string, value: Vec4, ignoreErrors: boolean = false) {
        if (!this.uniforms.has(uniform)) {
            if (ignoreErrors) return;
            throw `Cannot get uniform ${uniform}`;
        }
        this.gl.useProgram(this.program);
        this.gl.uniform4fv(this.uniforms.get(uniform) as WebGLUniformLocation, new Float32Array(value.values));
    }

    getName(): string {
        return this.name;
    }

}