export class BadResolutionError extends Error {
	constructor(msg?: string) {
		super(`Bad resolution: ${msg}`);
	}
}
