import { PacketListener } from '../packet_listener';

export class PLGamePaused extends PacketListener {
    register(): void {
        this.socket.on('gGamePaused', reason => {
            this.server.currentGameSession?.notifyGamePaused(reason);
        });
    }
}
