export class InvalidGLTFProperty extends Error {
	constructor(msg?: string) {
		super(`Invalid GLTF property: ${msg}`);
	}
}
