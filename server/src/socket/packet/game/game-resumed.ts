import { ServerPacket } from '../server-packet';

export class SvPktGGameResumed extends ServerPacket<'gGameResumed'> {
	constructor() {
		super('gGameResumed');
	}
}
