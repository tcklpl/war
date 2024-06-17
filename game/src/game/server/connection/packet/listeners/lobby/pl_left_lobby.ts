import { PacketListener } from '../packet_listener';

export class PLLeftLobby extends PacketListener {
    register(): void {
        this.socket.on('leftLobby', kicked => {
            this.server.currentLobby = undefined;
            this.server.lastLobbyExitReason = kicked ? 'kicked' : 'left';
        });
    }
}
