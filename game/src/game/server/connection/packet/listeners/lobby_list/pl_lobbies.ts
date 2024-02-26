import { PacketListener } from "../packet_listener";

export class PLLobbies extends PacketListener {

    register(): void {
        this.socket.on("lobbies", pkt => {
            this.server.lobbies.value = pkt;
        });
    }

}