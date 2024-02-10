import { ServerPacket } from "../server_packet";

export class ServerPacketLeftLobby extends ServerPacket {
    
    constructor(kicked?: boolean) {
        super("leftLobby", kicked);
    }
}