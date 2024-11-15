import { PacketListener } from '../packet_listener';

export class PLPlayerDisconnected extends PacketListener {
    register(): void {
        this.socket.on('gPlayerDisconnected', _player => {
            if (!this.server.currentLobby) return;
            // TODO: something
        });
    }
}
