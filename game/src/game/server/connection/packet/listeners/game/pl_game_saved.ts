import { PacketListener } from '../packet_listener';

export class PLGameSaved extends PacketListener {
    register(): void {
        this.socket.on('gGameSaved', () => {
            if (!this.server.currentLobby) return;
            // TODO: something
        });
    }
}
