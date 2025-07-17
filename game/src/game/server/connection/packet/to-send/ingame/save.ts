import { ClientPacket } from '../../client-packet';

export class ClientPacketGSave extends ClientPacket<'gSave'> {
	constructor() {
		super('gSave');
	}
}
