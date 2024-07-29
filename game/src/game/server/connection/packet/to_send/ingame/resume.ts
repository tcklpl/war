import { ClientPacket } from '../../client_packet';

export class ClientPacketGResume extends ClientPacket<'gResume'> {
    constructor() {
        super('gResume');
    }
}
