export class WebGPUUnsupportedError extends Error {
	constructor(msg?: string) {
		super(`WebGPU Unsupported error: ${msg}`);
	}
}
