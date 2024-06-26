import { ServerPacket } from '../server_packet';

export class SvPktGGameResumed extends ServerPacket<'gGameResumed'> {
    constructor() {
        super('gGameResumed');
    }
}
