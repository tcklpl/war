import { PacketListener } from '../packet_listener';

export class PLStartingGame extends PacketListener {
    register(): void {
        this.socket.on('lStartingGame', countdown => {
            game.state.server?.currentLobby.value?.setGameStartingCountdown(countdown);
        });
    }
}
