import { ClientPacket } from "../../../client_packet";

export class ClientPacketStartGame extends ClientPacket<"startGame"> {

    constructor() {
        super("startGame");
    }

}