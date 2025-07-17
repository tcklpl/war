export class UnknownConnectionError extends Error {
	constructor(msg?: string) {
		super(`Unknown connection error: ${msg}`);
	}
}
