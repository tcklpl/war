import { ServerPacket } from '../server-packet';

export class ServerPacketGameStartCancelled extends ServerPacket<'lGameStartCancelled'> {
	constructor() {
		super('lGameStartCancelled');
	}
}
