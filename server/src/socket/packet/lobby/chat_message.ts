import { LobbyPlayer } from '../../../game/player/lobby_player';
import { ServerPacket } from '../server_packet';

export class ServerPacketChatMessage extends ServerPacket<'chatMessage'> {
    constructor(sender: LobbyPlayer, msg: string) {
        super('chatMessage', sender.username, msg);
    }
}
