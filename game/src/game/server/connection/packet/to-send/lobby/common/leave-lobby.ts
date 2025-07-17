import { ClientPacket } from '../../../client-packet';

export class ClientPacketLeaveLobby extends ClientPacket<'leaveLobby'> {
	constructor() {
		super('leaveLobby');
	}
}
