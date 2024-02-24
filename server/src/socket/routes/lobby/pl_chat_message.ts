import { PacketListener } from "../packet_listener";

export class PLChatMessage extends PacketListener {

    register(): void {
        this._data.socket.on("sendChatMessage", (msg) => {
            this._data.player.lobby?.broadcastChatMessage(this._data.player, msg);
        });
    }
}