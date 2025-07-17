import { PacketListener } from '../packet-listener';

export class PLPlayerDisconnected extends PacketListener {
	register(): void {
		this.socket.on('gPlayerDisconnected', _player => {
			if (!this.server.currentLobby) return;
			// TODO: something
		});
	}
}
