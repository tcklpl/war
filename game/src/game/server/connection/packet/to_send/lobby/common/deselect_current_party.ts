import { ClientPacket } from "../../../client_packet";

export class ClientPacketDeselectParty extends ClientPacket<"deselectCurrentParty"> {

    constructor() {
        super("deselectCurrentParty");
    }

}