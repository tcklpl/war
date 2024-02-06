import { SocketRouteData } from "../socket_route_data";
import { socketRoutesLobbyChatMessage } from "./chat_message";
import { socketRoutesLobbyCreateLobby } from "./create_lobby";
import { socketRoutesLobbyJoinLobby } from "./join_lobby";
import { socketRoutesLobbyLeaveLobby } from "./leave_lobby";
import { socketRoutesLobbyRequireLobbies } from "./req_lobbies";

export const socketRoutesLobby = (data: SocketRouteData) => {

    socketRoutesLobbyRequireLobbies(data);
    socketRoutesLobbyCreateLobby(data);
    socketRoutesLobbyLeaveLobby(data);
    socketRoutesLobbyJoinLobby(data);
    socketRoutesLobbyChatMessage(data);

}