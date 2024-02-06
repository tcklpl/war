import { ClientPacket } from "../client_packet";

export class ClientPacketRequireLobbies extends ClientPacket {

    constructor() {
        super("requireLobbies");
    }

}