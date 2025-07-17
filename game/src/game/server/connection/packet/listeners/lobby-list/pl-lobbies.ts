import { PacketListener } from '../packet-listener';

export class PLLobbies extends PacketListener {
	register(): void {
		this.socket.on('lobbies', pkt => {
			this.server.lobbies = pkt;
		});
	}
}
