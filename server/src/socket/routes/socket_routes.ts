import { socketRoutesLobby } from "./lobby/routes_lobby";
import { SocketRouteData } from "./socket_route_data";

export const socketRoutes = (data: SocketRouteData) => {

    socketRoutesLobby(data);

}