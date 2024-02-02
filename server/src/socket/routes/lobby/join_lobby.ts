import svlog from "../../../utils/logging_utils";
import { ServerPacketJoinedLobby } from "../../packet/lobby/joined_lobby";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyJoinLobby = (data: SocketRouteData) => {

    data.socket.on("joinLobby", (lobbyName) => {
        
        svlog.log(`${data.player.username} is trying to join lobby "${lobbyName}"`);

        if (data.player.lobby) {
            svlog.log(`${data.player.username} failed to join lobby "${lobbyName}": Player is already in a lobby`);
            // TODO: send error
            return;
        }

        const lobby = data.gameServer.lobbyManager.getLobbyByName(lobbyName);
        if (!lobby) {
            svlog.log(`${data.player.username} failed to join lobby "${lobbyName}": Lobby doesn't exist`);
            // TODO: send error
            return;
        }

        if (!lobby.joinable) {
            svlog.log(`${data.player.username} failed to join lobby "${lobbyName}": Lobby isn't joinable`);
            // TODO: send error
            return;
        }

        data.player.joinLobby(lobby);
        new ServerPacketJoinedLobby(lobby).dispatch(data.player);
        svlog.log(`${data.player.username} joined lobby "${lobbyName}"`);

    });

}