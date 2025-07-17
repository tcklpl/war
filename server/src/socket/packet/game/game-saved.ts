import { ServerPacket } from '../server-packet';

export class SvPktGGameSaved extends ServerPacket<'gGameSaved'> {
	constructor() {
		super('gGameSaved');
	}
}
