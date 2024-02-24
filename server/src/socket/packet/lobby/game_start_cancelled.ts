import { ServerPacket } from "../server_packet";

export class ServerPacketGameStartCancelled extends ServerPacket<"lGameStartCancelled"> {

    constructor() {
        super("lGameStartCancelled");
    }
}