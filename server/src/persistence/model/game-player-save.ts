import type { GameParty } from ':protocol';
import type { GamePlayer } from '../../game/player/game-player';
import type { GameSave } from './game-save';

export class GamePlayerSave {
	id!: number;

	username!: string;

	game!: GameSave;

	owner!: boolean;

	party!: GameParty;

	fromGamePlayerAndGameSave(gp: GamePlayer, gs: GameSave) {
		this.username = gp.username;
		this.game = gs;
		this.owner = gp.game.isOwner(gp);
		this.party = gp.party.protocolValue;
		return this;
	}
}
