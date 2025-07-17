export class BufferOutOfBoundsError extends Error {
	constructor(msg?: string) {
		super(`Buffer OOB: ${msg}`);
	}
}
