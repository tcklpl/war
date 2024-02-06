import { ClientPacket } from "../client_packet";

export class ClientPacketSendChatMessage extends ClientPacket {

    constructor(msg: string) {
        super("sendChatMessage", msg);
    }

}