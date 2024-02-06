import { Lobby } from "../../../game/lobby/lobby";
import { ServerPacket } from "../server_packet";

export class ServerPacketJoinedLobby extends ServerPacket {
    
    constructor(lobby: Lobby) {
        super("joinedLobby", lobby.asProtocolLobbyState);
    }
}