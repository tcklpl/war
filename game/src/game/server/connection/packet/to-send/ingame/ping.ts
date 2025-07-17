import { ClientPacket } from '../../client-packet';

export class ClientPacketPing extends ClientPacket<'gPing'> {
	constructor(callback: () => void) {
		super('gPing', callback);
	}
}
