export class BadMatrixLengthError extends Error {
	constructor(msg?: string) {
		super(`Bad matrix length: ${msg}`);
	}
}
