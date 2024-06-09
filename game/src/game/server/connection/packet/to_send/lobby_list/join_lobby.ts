import { ClientPacket } from '../../client_packet';

export class ClientPacketJoinLobby extends ClientPacket<'joinLobby'> {
    constructor(lobbyName: string) {
        super('joinLobby', lobbyName);
    }
}
