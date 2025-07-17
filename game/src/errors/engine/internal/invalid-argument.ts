export class InvalidArgumentError extends Error {
	constructor(msg?: string) {
		super(`Invalid Argument Error: ${msg}`);
	}
}
