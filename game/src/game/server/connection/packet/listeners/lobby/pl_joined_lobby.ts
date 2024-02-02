import { WarGameLobby } from "../../../../../lobby/war_game_lobby";
import { PacketListener } from "../packet_listener";

export class PLJoinedLobby extends PacketListener {

    register(): void {
        this.socket.on("joinedLobby", pkt => {
            this.server.currentLobby.value = new WarGameLobby(pkt);
        });
    }

}