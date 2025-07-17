import { ClientPacket } from '../../../client-packet';

export class ClientPacketKickPlayer extends ClientPacket<'kickPlayer'> {
	constructor(player: string) {
		super('kickPlayer', player);
	}
}
