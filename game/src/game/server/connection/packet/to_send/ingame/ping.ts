import { ClientPacket } from '../../client_packet';

export class ClientPacketPing extends ClientPacket<'gPing'> {
    constructor(callback: () => void) {
        super('gPing', callback);
    }
}
