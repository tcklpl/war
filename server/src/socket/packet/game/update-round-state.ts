import type { RoundState } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketUpdateRoundState extends ServerPacket<'gUpdateRoundState'> {
	constructor(pkt: RoundState) {
		super('gUpdateRoundState', pkt);
	}
}
