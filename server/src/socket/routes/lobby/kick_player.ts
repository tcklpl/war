import { ServerPacketLeftLobby } from "../../packet/lobby/left_lobby";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyKickPlayer = (data: SocketRouteData) => {

    data.socket.on("kickPlayer", (player) => {
        if (data.player.lobby?.owner !== data.player) return;
        const playerToBeKicked = data.gameServer.playerManager.getPlayerByName(player);        
        if (!playerToBeKicked) return;
        data.player.lobby.changeOwnership(playerToBeKicked);
        if (playerToBeKicked.lobby !== data.player.lobby) return;
        playerToBeKicked.leaveCurrentLobby();
        new ServerPacketLeftLobby(true).dispatch(playerToBeKicked);
    });

}