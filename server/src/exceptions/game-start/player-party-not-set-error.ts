import type { Game } from '../../game/ingame/game';
import type { LobbyPlayer } from '../../game/player/lobby-player';
import { GameStartError } from './game-start-error';

export class PlayerPartyNotSetError extends GameStartError {
	constructor(game: Game, player: LobbyPlayer) {
		super(
			`Trying to consummate a player that didn't pick their party. On game '${game.id}' for player '${player.username}'`,
		);
	}
}
