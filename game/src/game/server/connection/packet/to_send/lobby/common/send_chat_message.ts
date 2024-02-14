import { ClientPacket } from "../../../client_packet";

export class ClientPacketSendChatMessage extends ClientPacket<"sendChatMessage"> {

    constructor(msg: string) {
        super("sendChatMessage", msg);
    }

}