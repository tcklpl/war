import { InitialGameStatePacket } from "../../../../../protocol";
import { ServerPacket } from "../server_packet";

export class ServerPacketInitialGameState extends ServerPacket<"gInitialGameState"> {

    constructor(pkt: InitialGameStatePacket) {
        super("gInitialGameState", pkt);
    }
}