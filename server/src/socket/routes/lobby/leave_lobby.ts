import { CfgServer } from "../../../config/default/cfg_server";
import svlog from "../../../utils/logging_utils";
import { ServerPacketLeftLobby } from "../../packet/lobby/left_lobby";
import { ServerPacketLobbies } from "../../packet/lobby/lobbies";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyLeaveLobby = (data: SocketRouteData) => {

    data.socket.on("leaveLobby", () => {
        
        svlog.log(`${data.player.username} left lobby "${data.player.lobby?.name}"`);
        data.player.leaveCurrentLobby();
        data.gameServer.lobbyManager.purgeEmptyLobbies();
        new ServerPacketLeftLobby().dispatch(data.player);

        // also send an updated lobby state package to the player, as they'll be back to the lobby selection screen
        new ServerPacketLobbies(data.gameServer.lobbyManager, data.configManager.getConfig(CfgServer));

    });

}