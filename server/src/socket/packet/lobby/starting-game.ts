import { ServerPacket } from '../server-packet';

export class ServerPacketStartingGame extends ServerPacket<'lStartingGame'> {
	constructor(seconds: number) {
		super('lStartingGame', seconds);
	}
}
