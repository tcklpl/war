import { PacketListener } from '../packet_listener';

export class PLGameResumed extends PacketListener {
    register(): void {
        this.socket.on('gGameResumed', () => {
            this.server.currentGameSession?.notifyGameResumed();
        });
    }
}
