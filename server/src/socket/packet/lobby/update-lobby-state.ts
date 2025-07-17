import type { Lobby } from '../../../game/lobby/lobby';
import { ServerPacket } from '../server-packet';

export class ServerPacketUpdateLobbyState extends ServerPacket<'updateLobbyState'> {
	constructor(lobby: Lobby) {
		super('updateLobbyState', lobby.asProtocolLobbyState);
	}
}
