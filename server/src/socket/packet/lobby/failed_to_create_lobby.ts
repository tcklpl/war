import { LobbyCreationFailReason } from "../../../../../protocol";
import { ServerPacket } from "../server_packet";

export class ServerPacketFailedToCreateLobby extends ServerPacket {

    constructor(reason: LobbyCreationFailReason) {
        super("failedToCreateLobby", reason);
    }
}