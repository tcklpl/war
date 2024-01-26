import { PacketListener } from "../packet_listener";

export class PLRoomList extends PacketListener {

    register(): void {
        this.socket.on("roomList", pkt => {
            this.server.gameRooms.value = pkt.state;
        });
    }

}