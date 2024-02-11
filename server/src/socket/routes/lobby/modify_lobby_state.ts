import { ServerPacketUpdateLobbyState } from "../../packet/lobby/update_lobby_state";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyModifyLobbyState = (data: SocketRouteData) => {

    data.socket.on("modifyLobbyState", (newState) => {
        const lobby = data.player.lobby;
        if (!lobby) return;
        if (lobby.owner !== data.player) return;
        lobby.replaceLobbyState(newState);
        new ServerPacketUpdateLobbyState(lobby).dispatch(...lobby.players);
        data.gameServer.lobbyManager.updateLobbyStatusForPlayers();

    });

}