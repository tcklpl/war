import { ClientPacket } from "../../../client_packet";

export class ClientPacketKickPlayer extends ClientPacket<"kickPlayer"> {

    constructor(player: string) {
        super("kickPlayer", player);
    }

}