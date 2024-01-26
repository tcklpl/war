import { ClientPacket } from "../client_packet";

export class ClientPacketRequireRoomList extends ClientPacket {

    constructor() {
        super("requireRoomList");
    }

}