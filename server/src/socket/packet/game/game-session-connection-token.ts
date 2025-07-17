import { ServerPacket } from '../server-packet';

export class ServerPacketGameSessionConnectionToken extends ServerPacket<'gGameSessionConnectionToken'> {
	constructor(token: string) {
		super('gGameSessionConnectionToken', token);
	}
}
