import { RoundState } from "../../../../../protocol";
import { ServerPacket } from "../server_packet";

export class ServerPacketUpdateRoundState extends ServerPacket<"gUpdateRoundState"> {

    constructor(pkt: RoundState) {
        super("gUpdateRoundState", pkt);
    }
}