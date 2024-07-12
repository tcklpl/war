import { PacketListener } from '../packet_listener';

export class PLPrematureGameEnd extends PacketListener {
    register(): void {
        this.socket.on('gPrematureGameEnd', reason => {
            if (!this.server.currentLobby) return;
            // TODO: something
        });
    }
}
