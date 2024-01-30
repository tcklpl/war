import { ClientPacket } from "../client_packet";

export class ClientPacketCreateLobby extends ClientPacket {

    constructor(name: string, joinable: boolean) {
        super("createLobby", name, joinable);
    }

}