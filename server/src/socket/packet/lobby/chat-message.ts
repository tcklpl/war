import type { LobbyPlayer } from '../../../game/player/lobby-player';
import { ServerPacket } from '../server-packet';

export class ServerPacketChatMessage extends ServerPacket<'chatMessage'> {
	constructor(sender: LobbyPlayer, msg: string) {
		super('chatMessage', sender.username, msg);
	}
}
