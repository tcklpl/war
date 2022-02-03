import { Mat4 } from "../data_formats/mat/mat4";
import { IShaderProgram } from "./programs/i_shader_program";
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

    getInstantiatedProgram<T extends IShaderProgram>(name: string, subclass: new(...args: any) => T): T {
        let program = this.getByName(name);
        if (!program) throw `Could not get program ${name} in order to instantiate it`;
        return new subclass(program);
    }

}