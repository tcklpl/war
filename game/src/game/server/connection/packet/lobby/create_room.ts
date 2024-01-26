import { ClientPacket } from "../client_packet";

export class ClientPacketCreateRoom extends ClientPacket {

    constructor(name: string) {
        super("createGameRoom", name);
    }

}