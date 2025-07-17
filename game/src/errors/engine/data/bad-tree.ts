export class BadTreeError extends Error {
	constructor(msg?: string) {
		super(`Bad tree: ${msg}`);
	}
}
