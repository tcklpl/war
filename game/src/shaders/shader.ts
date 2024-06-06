import { ShaderError } from '../errors/engine/shader/shader_error';

export abstract class Shader {
    private _name: string;
    private _module!: GPUShaderModule;

    constructor(name: string) {
        this._name = name;
    }

    protected async compileShader(source: string) {
        const module = device.createShaderModule({ code: source, label: this._name });
        const info = await module.getCompilationInfo();

        // if there's any compilation error
        if (info.messages.some(m => m.type === 'error')) {
            console.log(info.messages);
            console.log(source);
            throw new ShaderError(`Error when compiling shader '${this._name}'`);
        }

        if (info.messages.length > 0) {
            console.log(info.messages);
        }

        this._module = module;
    }

    get module() {
        return this._module;
    }
}
