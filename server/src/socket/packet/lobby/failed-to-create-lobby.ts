import type { LobbyCreationFailReason } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketFailedToCreateLobby extends ServerPacket<'failedToCreateLobby'> {
	constructor(reason: LobbyCreationFailReason) {
		super('failedToCreateLobby', reason);
	}
}
