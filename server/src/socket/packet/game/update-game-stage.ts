import type { GameStage } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketUpdateGameStage extends ServerPacket<'gUpdateGameStage'> {
	constructor(pkt: GameStage) {
		super('gUpdateGameStage', pkt);
	}
}
