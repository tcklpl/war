import { ClientPacket } from '../../client-packet';

export class ClientPacketJoinLobby extends ClientPacket<'joinLobby'> {
	constructor(lobbyName: string) {
		super('joinLobby', lobbyName);
	}
}
