import { ClientPacket } from "../../../client_packet";

export class ClientPacketCancelGameStart extends ClientPacket<"lCancelGameStart"> {

    constructor() {
        super("lCancelGameStart");
    }

}