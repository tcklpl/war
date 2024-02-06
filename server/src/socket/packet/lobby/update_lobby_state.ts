import { Lobby } from "../../../game/lobby/lobby";
import { ServerPacket } from "../server_packet";

export class ServerPacketUpdateLobbyState extends ServerPacket {
    
    constructor(lobby: Lobby) {
        super("updateLobbyState", lobby.asProtocolLobbyState);
    }
}