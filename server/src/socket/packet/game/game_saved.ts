import { ServerPacket } from '../server_packet';

export class SvPktGGameSaved extends ServerPacket<'gGameSaved'> {
    constructor() {
        super('gGameSaved');
    }
}
