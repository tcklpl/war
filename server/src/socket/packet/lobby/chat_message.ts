import { Player } from "../../../game/player/player";
import { ServerPacket } from "../server_packet";

export class ServerPacketChatMessage extends ServerPacket {
    
    constructor(sender: Player, msg: string) {
        super("chatMessage", sender.username, msg);
    }
}