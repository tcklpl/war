import { GameStage } from "../../../../../protocol";
import { ServerPacket } from "../server_packet";

export class ServerPacketUpdateGameStage extends ServerPacket<"gUpdateGameStage"> {

    constructor(pkt: GameStage) {
        super("gUpdateGameStage", pkt);
    }
}