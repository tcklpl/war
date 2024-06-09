import { GameError } from "../../../../../protocol/src/protocol/data/ingame/game_error";
import { ServerPacket } from "../server_packet";

export class ServerPacketGameError extends ServerPacket<"gGameError"> {

    constructor(err: GameError) {
        super("gGameError", err);
    }
}