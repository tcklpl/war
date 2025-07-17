export class InvalidCanvasError extends Error {
	constructor(msg?: string) {
		super(`Invalid canvas error: ${msg}`);
	}
}
