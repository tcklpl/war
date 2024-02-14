import { GameParty } from "../../../../../../../../../protocol";
import { ClientPacket } from "../../../client_packet";

export class ClientPacketSelectParty extends ClientPacket<"selectParty"> {

    constructor(party: GameParty) {
        super("selectParty", party);
    }

}