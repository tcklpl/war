import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyTransferOwnership = (data: SocketRouteData) => {

    data.socket.on("transferLobbyOwnership", (to) => {
        if (data.player.lobby?.owner !== data.player) return;
        const newLobbyOwner = data.gameServer.playerManager.getPlayerByName(to);        
        if (!newLobbyOwner) return;
        data.player.lobby.changeOwnership(newLobbyOwner);

    });

}