import { ShaderError } from '../errors/engine/shader/shader-error';

export abstract class Shader {
	protected abstract _source: string;
	private _module?: GPUShaderModule;

	constructor(public readonly name: string) {}

	async compile() {
		const module = device.createShaderModule({
			code: this._source,
			label: this.name,
		});
		const info = await module.getCompilationInfo();

		// if there's any compilation error
		if (info.messages.some(m => m.type === 'error')) {
			console.log(info.messages);
			console.log(this._source);
			throw new ShaderError(`Error when compiling shader '${this.name}'`);
		}

		if (info.messages.length > 0) {
			console.log(info.messages);
		}

		this._module = module;
	}

	get module() {
		if (!this._module)
			throw new ShaderError(`Trying to access shader module before it was compiled, on shader '${this.name}'`);
		return this._module;
	}
}
