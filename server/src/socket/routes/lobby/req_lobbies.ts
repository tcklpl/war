import { CfgServer } from "../../../config/default/cfg_server";
import { ServerPacketLobbies } from "../../packet/lobby/svpkt_lobbies";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyRequireLobbies = (data: SocketRouteData) => {

    data.socket.on("requireLobbies", () => {
        
        const packet = new ServerPacketLobbies(data.gameServer.gameRoomManager, data.configManager.getConfig(CfgServer));
        packet.dispatch(data.player);

    });

}