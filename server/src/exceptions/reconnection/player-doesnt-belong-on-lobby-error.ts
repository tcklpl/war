export class PlayerDoesntBelongOnLobbyError extends Error {
	constructor() {
		super('This player was not on this lobby');
	}
}
