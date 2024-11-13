import { type PrematureGameEndReason } from '../../../../../protocol';
import { ServerPacket } from '../server_packet';

export class SvPktGPrematureGameEnd extends ServerPacket<'gPrematureGameEnd'> {
    constructor(reason: PrematureGameEndReason) {
        super('gPrematureGameEnd', reason);
    }
}
