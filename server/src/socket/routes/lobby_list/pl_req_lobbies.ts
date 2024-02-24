import { CfgServer } from "../../../config/default/cfg_server";
import { ServerPacketLobbies } from "../../packet/lobby/lobbies";
import { PacketListener } from "../packet_listener";

export class PLRequestLobbies extends PacketListener {

    register(): void {
        this._data.socket.on("requireLobbies", () => {
        
            const packet = new ServerPacketLobbies(this._data.gameServer.lobbyManager, this._data.configManager.getConfig(CfgServer));
            packet.dispatch(this._data.player);
    
        });
    }
}
