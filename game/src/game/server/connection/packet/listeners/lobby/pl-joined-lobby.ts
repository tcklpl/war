import { WarGameLobby } from '../../../../../lobby/war-game-lobby';
import { PacketListener } from '../packet-listener';

export class PLJoinedLobby extends PacketListener {
	register(): void {
		this.socket.on('joinedLobby', pkt => {
			this.server.currentLobby = new WarGameLobby(pkt);
		});
	}
}
