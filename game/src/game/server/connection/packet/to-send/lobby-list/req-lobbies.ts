import { ClientPacket } from '../../client-packet';

export class ClientPacketRequireLobbies extends ClientPacket<'requireLobbies'> {
	constructor() {
		super('requireLobbies');
	}
}
