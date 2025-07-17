import { ClientPacket } from '../../../client-packet';

export class ClientPacketTransferLobbyOwnership extends ClientPacket<'transferLobbyOwnership'> {
	constructor(newOwner: string) {
		super('transferLobbyOwnership', newOwner);
	}
}
