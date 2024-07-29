import { ClientPacket } from '../../client_packet';

export class ClientPacketGSave extends ClientPacket<'gSave'> {
    constructor() {
        super('gSave');
    }
}
