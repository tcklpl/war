import { GameSocket } from "../../../../../@types/socket";
import { WarServer } from "../../../war_server";
import { PLLobbies } from "./lobby/pl_lobbies";


export const registerPacketListeners = (socket: GameSocket, server: WarServer) => {
    return [
        // lobby
        new PLLobbies(socket, server)
    ];
}