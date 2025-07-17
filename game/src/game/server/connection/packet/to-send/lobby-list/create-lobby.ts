import { ClientPacket } from '../../client-packet';

export class ClientPacketCreateLobby extends ClientPacket<'createLobby'> {
	constructor(name: string, joinable: boolean) {
		super('createLobby', name, joinable);
	}
}
