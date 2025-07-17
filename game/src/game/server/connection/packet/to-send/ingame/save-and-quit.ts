import { ClientPacket } from '../../client-packet';

export class ClientPacketGSaveAndQuit extends ClientPacket<'gSaveAndQuit'> {
	constructor() {
		super('gSaveAndQuit');
	}
}
