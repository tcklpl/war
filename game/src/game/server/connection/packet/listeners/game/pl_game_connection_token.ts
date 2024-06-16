import { PacketListener } from '../packet_listener';

export class PLGameConnectionToken extends PacketListener {
    register(): void {
        this.socket.on('gGameSessionConnectionToken', token => {
            if (!this.server.currentLobby.value) return;
            if (game.state.server?.currentLobby.value?.gameSession.value)
                game.state.server.currentLobby.value.gameSession.value.token.value = token;
        });
    }
}
