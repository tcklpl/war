import type { Lobby } from '../../../game/lobby/lobby';
import { ServerPacket } from '../server-packet';

export class ServerPacketJoinedLobby extends ServerPacket<'joinedLobby'> {
	constructor(lobby: Lobby) {
		super('joinedLobby', lobby.asProtocolLobbyState);
	}
}
