import { PacketListener } from '../packet_listener';

export class PLGameConnectionToken extends PacketListener {
    register(): void {
        this.socket.on('gGameSessionConnectionToken', token => {
            if (!this.server.currentLobby) return;
            if (game.state.server?.currentGameSession) game.state.server.currentGameSession.token = token;
        });
    }
}
