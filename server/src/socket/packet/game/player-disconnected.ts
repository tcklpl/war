import type { GamePlayer } from '../../../game/player/game-player';
import { ServerPacket } from '../server-packet';

export class SvPktGPlayerDisconnected extends ServerPacket<'gPlayerDisconnected'> {
	constructor(player: GamePlayer) {
		super('gPlayerDisconnected', player.username);
	}
}
