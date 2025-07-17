import { PacketListener } from '../packet-listener';

export class PLPlayerReconnected extends PacketListener {
	register(): void {
		this.socket.on('gPlayerReconnected', (_player, _allOnline) => {
			if (!this.server.currentLobby) return;
			// TODO: something
		});
	}
}
