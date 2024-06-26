import { ServerPacket } from '../server_packet';

export class SvPktGGamePaused extends ServerPacket<'gGamePaused'> {
    constructor() {
        super('gGamePaused');
    }
}
