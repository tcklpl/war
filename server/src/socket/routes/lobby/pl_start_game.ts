import { PacketListener } from "../packet_listener";

export class PLStartGame extends PacketListener {

    register(): void {
        this._data.socket.on("startGame", () => {
            if (!this._data.player.lobby) return;
            if (this._data.player.lobby.owner !== this._data.player) return;
            this._data.player.lobby.startGame();
        });
    }
}