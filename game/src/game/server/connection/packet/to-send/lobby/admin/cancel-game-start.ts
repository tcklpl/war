import { ClientPacket } from '../../../client-packet';

export class ClientPacketCancelGameStart extends ClientPacket<'lCancelGameStart'> {
	constructor() {
		super('lCancelGameStart');
	}
}
