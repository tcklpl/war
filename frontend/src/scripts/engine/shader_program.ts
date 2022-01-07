import { Game } from "../game";
import { Mat4 } from "./data_formats/mat/mat4";
import { Vec4 } from "./data_formats/vec/vec4";
import { ShaderUtils } from "./engine_shader_utils";
import { MaterialLocation } from "./material";

export class ShaderProgram {

    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private attributes: Map<string, number> = new Map();
    private uniforms: Map<string, WebGLUniformLocation> = new Map();
    private name: string;

    private materialLocation?: MaterialLocation;

    constructor(name: string, vert: string, frag: string) {
        if (!vert || !frag) throw "Failed to create shader program with empty vert or frag source";
        this.gl = Game.instance.getGL();

        this.name = name;
        
        this.program = ShaderUtils.createProgram(this.gl, vert, frag);
        this.gl.useProgram(this.program);

        let vertSourceWords = vert.split('\n').filter(l => l.startsWith('uniform ')).join(' ').split(' ');
        vertSourceWords.filter(x => x.startsWith('a_')).forEach(x => this.attributes.set(x, this.gl.getAttribLocation(this.program, x)));
        vertSourceWords.filter(x => x.startsWith('u_')).forEach(x => {
            let name = x.replace(';', '');
            let location = this.gl.getUniformLocation(this.program, name);
            if (location)
                this.uniforms.set(name, location);
        });

        let fragSourceWords = frag.split('\n').filter(l => l.startsWith('uniform ')).join(' ').split(' ');
        fragSourceWords.filter(x => x.startsWith('a_')).forEach(x => this.attributes.set(x, this.gl.getAttribLocation(this.program, x)));
        fragSourceWords.filter(x => x.startsWith('u_')).forEach(x => {
            let name = x.replace(';', '');
            let location = this.gl.getUniformLocation(this.program, name);
            if (location)
                this.uniforms.set(name, location);
        });

        this.tryToGetMaterialUniforms();
    }

    private tryToGetMaterialUniforms() {
        let albedo = this.uniforms.get('u_map_albedo');
        let normal = this.uniforms.get('u_map_normal');
        console.log(`Albedo: ${albedo}, normal: ${normal}`);
        if (albedo && normal) {
            console.log('got albedo and normal uniforms!');
            this.materialLocation = {
                albedo: albedo,
                normal: normal
            }
        }
    }

    hasMaterialUniforms() {
        return this.materialLocation != undefined;
    }

    public get materialUniforms() {
        return this.materialLocation;
    }

    use() {
        this.gl.useProgram(this.program);
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