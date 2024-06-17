import { PacketListener } from '../packet_listener';

export class PLGameStartCancelled extends PacketListener {
    register(): void {
        this.socket.on('lGameStartCancelled', () => {
            game.state.server?.currentLobby?.cancelGameStartCountdown();
        });
    }
}
