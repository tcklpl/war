import { PacketListener } from "../packet_listener";

export class PLGameAction extends PacketListener {

    register(): void {
        this._data.socket.on("gGameAction", (action) => {
            if (!this._data.player.lobby) return;
            if (!this._data.player.lobby.game) return;
            this._data.player.lobby.game.onPlayerAction("game action", action, this._data.player);
        });
    }
}