import { CfgServer } from "../../../config/default/cfg_server";
import svlog from "../../../utils/logging_utils";
import { ServerPacketLeftLobby } from "../../packet/lobby/left_lobby";
import { ServerPacketLobbies } from "../../packet/lobby/lobbies";
import { PacketListener } from "../packet_listener";

export class PLLeaveLobby extends PacketListener {

    register(): void {
        this._data.socket.on("leaveLobby", () => {
        
            svlog.info(`${this._data.player.username} left lobby "${this._data.player.lobby?.name}"`);
            this._data.player.leaveCurrentLobby();
            this._data.gameServer.lobbyManager.purgeEmptyLobbies();
            new ServerPacketLeftLobby().dispatch(this._data.player);
    
            // also send an updated lobby state package to the player, as they'll be back to the lobby selection screen
            new ServerPacketLobbies(this._data.gameServer.lobbyManager, this._data.configManager.getConfig(CfgServer)).dispatch(this._data.player);
    
        });
    
    }
}
