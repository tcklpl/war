import { PacketListener } from '../packet_listener';

export class PLPrematureGameEnd extends PacketListener {
    register(): void {
        this.socket.on('gPrematureGameEnd', () => {
            if (!this.server.currentLobby) return;
            this.server.currentLobby = undefined;
            this.server.currentGameSession = undefined;
            this.server.lastLobbyExitReason = 'room closed';
        });
    }
}
