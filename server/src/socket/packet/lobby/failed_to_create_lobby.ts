import { type LobbyCreationFailReason } from ':protocol';
import { ServerPacket } from '../server_packet';

export class ServerPacketFailedToCreateLobby extends ServerPacket<'failedToCreateLobby'> {
    constructor(reason: LobbyCreationFailReason) {
        super('failedToCreateLobby', reason);
    }
}
