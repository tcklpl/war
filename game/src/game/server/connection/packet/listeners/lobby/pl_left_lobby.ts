import { PacketListener } from "../packet_listener";

export class PLLeftLobby extends PacketListener {

    register(): void {
        this.socket.on("leftLobby", () => {
            this.server.currentLobby.value = undefined;
        });
    }

}