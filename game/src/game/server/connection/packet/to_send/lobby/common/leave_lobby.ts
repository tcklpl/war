import { ClientPacket } from '../../../client_packet';

export class ClientPacketLeaveLobby extends ClientPacket<'leaveLobby'> {
    constructor() {
        super('leaveLobby');
    }
}
