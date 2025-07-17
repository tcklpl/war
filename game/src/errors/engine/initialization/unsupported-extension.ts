export class UnsupportedWebgl2ExtensionError extends Error {
	constructor(msg?: string) {
		super(`Unsupported extension error: ${msg}`);
	}
}
