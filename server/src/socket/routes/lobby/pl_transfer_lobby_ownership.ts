import { PacketListener } from "../packet_listener";

export class PLTransferLobbyOwnership extends PacketListener {

    register(): void {
        this._data.socket.on("transferLobbyOwnership", (to) => {
            if (this._data.player.lobby?.owner !== this._data.player) return;
            const newLobbyOwner = this._data.gameServer.playerManager.getPlayerByName(to);        
            if (!newLobbyOwner) return;
            this._data.player.lobby.changeOwnership(newLobbyOwner);
    
        });
    }
}
