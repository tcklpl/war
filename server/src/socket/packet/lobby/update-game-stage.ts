import type { Game } from '../../../game/ingame/game';
import { ServerPacket } from '../server-packet';

export class ServerPacketUpdateGameStage extends ServerPacket<'gUpdateGameStage'> {
	constructor(game: Game) {
		super('gUpdateGameStage', game.stage);
	}
}
