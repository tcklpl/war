import { ServerPacket } from "../server_packet";

export class ServerPacketLeftLobby extends ServerPacket {
    
    constructor() {
        super("leftLobby");
    }
}