import { ClientPacket } from '../../client-packet';

export class ClientPacketGPause extends ClientPacket<'gPause'> {
	constructor() {
		super('gPause');
	}
}
