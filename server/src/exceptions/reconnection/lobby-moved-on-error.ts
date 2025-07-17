export class LobbyMovedOnError extends Error {
	constructor() {
		super('The game had moved on without the player');
	}
}
