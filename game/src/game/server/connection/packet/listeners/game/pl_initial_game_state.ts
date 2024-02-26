import { WarGameSession } from "../../../../../lobby/war_game_session";
import { PacketListener } from "../packet_listener";

export class PLInitialGameState extends PacketListener {

    register(): void {
        this.socket.on("gInitialGameState", state => {
            if (!this.server.currentLobby.value) return;
            this.server.currentLobby.value.gameSession.value = new WarGameSession(state);
        });
    }
}