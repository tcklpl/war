export class GameStartError extends Error {
	constructor(msg: string) {
		super(`Game Start Error > ${msg}`);
	}
}
