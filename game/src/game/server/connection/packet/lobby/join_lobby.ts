import { ClientPacket } from "../client_packet";

export class ClientPacketJoinLobby extends ClientPacket {

    constructor(lobbyName: string) {
        super("joinLobby", lobbyName);
    }

}