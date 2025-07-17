export class MissingTextureError extends Error {
	constructor(msg?: string) {
		super(`Missing Texture error: ${msg}`);
	}
}
