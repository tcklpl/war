export class ShaderError extends Error {
	constructor(msg?: string) {
		super(`Shader error: ${msg}`);
	}
}
