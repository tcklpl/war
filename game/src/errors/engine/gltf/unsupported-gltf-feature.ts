export class UnsupportedGLTFFeatureError extends Error {
	constructor(msg?: string) {
		super(`Unsupported GLTF feature: ${msg}`);
	}
}
