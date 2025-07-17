import { PacketListener } from '../packet-listener';

export class PLStartingGame extends PacketListener {
	register(): void {
		this.socket.on('lStartingGame', countdown => {
			game.state.server?.currentLobby?.setGameStartingCountdown(countdown);
		});
	}
}
