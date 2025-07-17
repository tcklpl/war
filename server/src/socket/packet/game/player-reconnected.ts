import type { GamePlayer } from '../../../game/player/game-player';
import { ServerPacket } from '../server-packet';

export class SvPktGPlayerReconnected extends ServerPacket<'gPlayerReconnected'> {
	constructor(player: GamePlayer) {
		super('gPlayerReconnected', player.username, !player.game.players.find(x => !x.online));
	}
}
