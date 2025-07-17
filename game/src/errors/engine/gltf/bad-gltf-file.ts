export class BadGLTFFileError extends Error {
	constructor(msg?: string) {
		super(`Bad GLTF file: ${msg}`);
	}
}
