import { ServerPacket } from '../server_packet';

export class ServerPacketLeftLobby extends ServerPacket<'leftLobby'> {
    constructor(kicked?: boolean) {
        super('leftLobby', kicked);
    }
}
