import { LobbyCreationFailReason } from "../../../../../protocol";
import { OverLimitError } from "../../../exceptions/over_limit_error";
import { PlayerAlreadyOwnsALobbyError } from "../../../exceptions/player_already_owns_a_lobby_error";
import { UnavailableNameError } from "../../../exceptions/unavailable_name_error";
import svlog from "../../../utils/logging_utils";
import { ServerPacketFailedToCreateLobby } from "../../packet/lobby/failed_to_create_lobby";
import { ServerPacketJoinedLobby } from "../../packet/lobby/joined_lobby";
import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyCreateLobby = (data: SocketRouteData) => {

    data.socket.on("createLobby", (name, joinable) => {
        
        try {

            const lobby = data.gameServer.lobbyManager.createLobby(data.player, name, joinable);
            svlog.log(`${data.player.username} created lobby "${name}" (current lobbies: ${data.gameServer.lobbyManager.lobbies.length} / ${data.gameServer.lobbyManager.maxLobbies})`);
            new ServerPacketJoinedLobby(lobby).dispatch(data.player);
            
        } catch (e) {

            let errorReason: LobbyCreationFailReason;
            if (e instanceof OverLimitError) {
                svlog.log(`${data.player.username} failed to create lobby "${name}": The max numbers of lobbies was reached`);
                errorReason = "full";
            }
            else if (e instanceof UnavailableNameError) {
                svlog.log(`${data.player.username} failed to create lobby "${name}": This lobby name is already in use`);
                errorReason = "unavailable name";
            }
            else if (e instanceof PlayerAlreadyOwnsALobbyError) {
                svlog.log(`${data.player.username} failed to create lobby "${name}": ${data.player.username} already owns a lobby`);
                errorReason = "already owner";
            }
            else {
                svlog.err(`${data.player.username} failed to create lobby "${name}": Unknown error`);
                errorReason = "other";
            }
            new ServerPacketFailedToCreateLobby(errorReason).dispatch(data.player);

        }

    });

}