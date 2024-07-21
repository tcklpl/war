import { ClientPacket } from '../../client_packet';

export class ClientPacketGSaveAndQuit extends ClientPacket<'gSaveAndQuit'> {
    constructor() {
        super('gSaveAndQuit');
    }
}
