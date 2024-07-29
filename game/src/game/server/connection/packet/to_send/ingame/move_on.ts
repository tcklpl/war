import { ClientPacket } from '../../client_packet';

export class ClientPacketGMoveOn extends ClientPacket<'gMoveOn'> {
    constructor() {
        super('gMoveOn');
    }
}
