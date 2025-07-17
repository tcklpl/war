import { WarGameSession } from '../../../../../lobby/war-game-session';
import { PacketListener } from '../packet-listener';

export class PLInitialGameState extends PacketListener {
	register(): void {
		this.socket.on('gInitialGameState', state => {
			this.server.currentGameSession = new WarGameSession(state);
		});
	}
}
