import { ClientPacket } from "../../client_packet";

export class ClientPacketRequireLobbies extends ClientPacket<"requireLobbies"> {

    constructor() {
        super("requireLobbies");
    }

}