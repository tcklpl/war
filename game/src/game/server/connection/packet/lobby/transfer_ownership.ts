import { ClientPacket } from "../client_packet";

export class ClientPacketTransferLobbyOwnership extends ClientPacket {

    constructor(newOwner: string) {
        super("transferLobbyOwnership", newOwner);
    }

}