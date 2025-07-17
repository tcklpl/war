import { ServerPacket } from '../server-packet';

export class ServerPacketLeftLobby extends ServerPacket<'leftLobby'> {
	constructor(kicked?: boolean) {
		super('leftLobby', kicked);
	}
}
