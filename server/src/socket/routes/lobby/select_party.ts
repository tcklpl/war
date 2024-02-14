import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbySelectParty = (data: SocketRouteData) => {

    data.socket.on("selectParty", (party) => {
        
        data.player.lobby?.setPlayerParty(data.player, party);

    });

}