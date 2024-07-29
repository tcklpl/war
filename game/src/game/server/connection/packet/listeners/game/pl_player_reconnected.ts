import { PacketListener } from '../packet_listener';

export class PLPlayerReconnected extends PacketListener {
    register(): void {
        this.socket.on('gPlayerReconnected', (player, allOnline) => {
            if (!this.server.currentLobby) return;
            // TODO: something
        });
    }
}
