import { ClientPacket } from '../../../client-packet';

export class ClientPacketStartGame extends ClientPacket<'startGame'> {
	constructor() {
		super('startGame');
	}
}
