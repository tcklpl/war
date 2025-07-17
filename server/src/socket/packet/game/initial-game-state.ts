import type { InitialGameStatePacket } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketInitialGameState extends ServerPacket<'gInitialGameState'> {
	constructor(pkt: InitialGameStatePacket) {
		super('gInitialGameState', pkt);
	}
}
