import { ClientPacket } from '../../client-packet';

export class ClientPacketGMoveOn extends ClientPacket<'gMoveOn'> {
	constructor() {
		super('gMoveOn');
	}
}
