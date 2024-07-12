import { PacketListener } from '../packet_listener';

export class PLPlayerDisconnected extends PacketListener {
    register(): void {
        this.socket.on('gPlayerDisconnected', player => {
            if (!this.server.currentLobby) return;
            // TODO: something
        });
    }
}
