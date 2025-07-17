import { ClientPacket } from '../../../client-packet';

export class ClientPacketSendChatMessage extends ClientPacket<'sendChatMessage'> {
	constructor(msg: string) {
		super('sendChatMessage', msg);
	}
}
