import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyDeselectParty = (data: SocketRouteData) => {

    data.socket.on("deselectCurrentParty", () => {
        
        data.player.lobby?.deselectPlayerParty(data.player);

    });

}