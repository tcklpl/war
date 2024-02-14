import { SocketRouteData } from "../socket_route_data";
import { socketRoutesLobbyChatMessage } from "./chat_message";
import { socketRoutesLobbyCreateLobby } from "./create_lobby";
import { socketRoutesLobbyDeselectParty } from "./deselect_party";
import { socketRoutesLobbyJoinLobby } from "./join_lobby";
import { socketRoutesLobbyKickPlayer } from "./kick_player";
import { socketRoutesLobbyLeaveLobby } from "./leave_lobby";
import { socketRoutesLobbyModifyLobbyState } from "./modify_lobby_state";
import { socketRoutesLobbyRequireLobbies } from "./req_lobbies";
import { socketRoutesLobbySelectParty } from "./select_party";
import { socketRoutesLobbyTransferOwnership } from "./transfer_lobby_ownership";

export const socketRoutesLobby = (data: SocketRouteData) => {

    socketRoutesLobbyRequireLobbies(data);
    socketRoutesLobbyCreateLobby(data);
    socketRoutesLobbyLeaveLobby(data);
    socketRoutesLobbyJoinLobby(data);
    socketRoutesLobbyChatMessage(data);
    socketRoutesLobbyTransferOwnership(data);
    socketRoutesLobbyKickPlayer(data);
    socketRoutesLobbyModifyLobbyState(data);
    socketRoutesLobbySelectParty(data);
    socketRoutesLobbyDeselectParty(data);

}