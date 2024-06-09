import { PacketListener } from "../packet_listener";

export class PLDeselectParty extends PacketListener {

    register(): void {
        this._data.socket.on("deselectCurrentParty", () => {
        
            this._data.player.lobby?.deselectPlayerParty(this._data.player);
    
        });
    }
}
