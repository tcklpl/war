export class BadPipelineError extends Error {
	constructor(msg?: string) {
		super(`Bad Render Pipeline: ${msg}`);
	}
}
