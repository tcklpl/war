export class BadVectorLengthError extends Error {
	constructor(msg?: string) {
		super(`Bad vector length: ${msg}`);
	}
}
