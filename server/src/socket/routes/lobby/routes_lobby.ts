import { SocketRouteData } from "../socket_route_data";
import { socketRoutesLobbyCreateLobby } from "./create_lobby";
import { socketRoutesLobbyRequireLobbies } from "./req_lobbies";

export const socketRoutesLobby = (data: SocketRouteData) => {

    socketRoutesLobbyRequireLobbies(data);
    socketRoutesLobbyCreateLobby(data);

}