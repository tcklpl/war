import { ClientPacket } from "../client_packet";

export class ClientPacketLeaveLobby extends ClientPacket {

    constructor() {
        super("leaveLobby");
    }

}