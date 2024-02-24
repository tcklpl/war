import { PacketListener } from "../packet_listener";

export class PLSelectParty extends PacketListener {

    register(): void {
        this._data.socket.on("selectParty", (party) => {
        
            this._data.player.lobby?.setPlayerParty(this._data.player, party);
    
        });
    }
}
