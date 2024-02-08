import { ClientPacket } from "../client_packet";

export class ClientPacketKickPlayer extends ClientPacket {

    constructor(player: string) {
        super("kickPlayer", player);
    }

}