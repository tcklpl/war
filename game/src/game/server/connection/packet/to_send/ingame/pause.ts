import { ClientPacket } from '../../client_packet';

export class ClientPacketGPause extends ClientPacket<'gPause'> {
    constructor() {
        super('gPause');
    }
}
