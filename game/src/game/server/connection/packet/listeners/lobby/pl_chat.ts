import { PacketListener } from "../packet_listener";

export class PLChat extends PacketListener {

    register(): void {
        this.socket.on("chatMessage", (sender, msg) => {
            if (this.server.currentLobby.value) {
                this.server.currentLobby.value.chat.registerNewMessage({ sender, msg });
            }
        });
    }

}