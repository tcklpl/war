import { SocketRouteData } from "../socket_route_data";
import { socketRoutesLobbyRequireLobbies } from "./req_lobbies";

export const socketRoutesLobby = (data: SocketRouteData) => {

    socketRoutesLobbyRequireLobbies(data);

}