import { PacketListener } from "../packet_listener";

export class PLSelectStartingTerritory extends PacketListener {

    register(): void {
        this._data.socket.on("gSelectStartingTerritory", (code) => {
            if (!this._data.player.lobby) return;
            if (!this._data.player.lobby.game) return;
            this._data.player.lobby.game.onPlayerAction("select initial territory", code, this._data.player);
        });
    }
}