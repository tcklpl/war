import { ClientPacket } from '../../../client-packet';

export class ClientPacketDeselectParty extends ClientPacket<'deselectCurrentParty'> {
	constructor() {
		super('deselectCurrentParty');
	}
}
