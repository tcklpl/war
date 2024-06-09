import { PacketListener } from '../packet_listener';

export class PLUpdateLobbyState extends PacketListener {
    register(): void {
        this.socket.on('updateLobbyState', pkt => {
            if (this.server.currentLobby.value) {
                this.server.currentLobby.value.state.value = pkt;
            } else {
                console.warn('Trying to set lobby state for non-existent lobby');
            }
        });
    }
}
