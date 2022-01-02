import { Mat4 } from "./data_formats/mat/mat4";
import { ShaderProgram } from "./shader_program";

export class ShaderManager {

    private programs: ShaderProgram[] = [];

    registerShaderProgram(program: ShaderProgram) {
        if (this.programs.some(x => x.getName() == program.getName())) throw `Failed to register shader program ${program.getName()}: name already registered`;
        this.programs.push(program);
    }

    getByName(name: string) {
        return this.programs.find(x => x.getName() == name);
    }

    setUniformMat4OnAllPrograms(name: string, value: Mat4) {
        this.programs.forEach(p => p.setUniformMat4f(name, value));
    }
}