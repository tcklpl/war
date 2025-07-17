import { PacketListener } from '../packet-listener';

export class PLGamePaused extends PacketListener {
	register(): void {
		this.socket.on('gGamePaused', reason => {
			game.events.dispatchEvent('onGamePause', reason);
		});
	}
}
