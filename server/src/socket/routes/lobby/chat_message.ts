import { SocketRouteData } from "../socket_route_data";

export const socketRoutesLobbyChatMessage = (data: SocketRouteData) => {

    data.socket.on("sendChatMessage", (msg) => {
        
        data.player.lobby?.broadcastChatMessage(data.player, msg);

    });

}