export class PlayerAlreadyInLobbyError extends Error {
	constructor() {
		super('The game already has a player with the same name');
	}
}
