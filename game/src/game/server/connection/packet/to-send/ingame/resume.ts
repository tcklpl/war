import { ClientPacket } from '../../client-packet';

export class ClientPacketGResume extends ClientPacket<'gResume'> {
	constructor() {
		super('gResume');
	}
}
