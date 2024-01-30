import { OverLimitError } from "../../../exceptions/over_limit_error";
import { UnavailableNameError } from "../../../exceptions/unavailable_name_error";
import svlog from "../../../utils/logging_utils";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyCreateLobby = (data: SocketRouteData) => {

    data.socket.on("createLobby", (name, joinable) => {
        
        try {

            data.gameServer.lobbyManager.createLobby(data.player, name, joinable);
            svlog.log(`${data.player.username} created lobby "${name}" (current lobbies: ${data.gameServer.lobbyManager.lobbies.length} / ${data.gameServer.lobbyManager.maxLobbies})`);
            
        } catch (e) {

            if (e instanceof OverLimitError) {
                svlog.log(`${data.player.username} failed to create lobby "${name}": The max numbers of lobbies was reached`);
            }
            else if (e instanceof UnavailableNameError) {
                svlog.log(`${data.player.username} failed to create lobby "${name}": This lobby name is already in use`);
            }

        }

    });

}