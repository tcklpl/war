export class BufferError extends Error {
	constructor(msg?: string) {
		super(`Buffer error: ${msg}`);
	}
}
