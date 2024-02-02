import { GameSocket } from "../../../../../@types/socket";
import { WarServer } from "../../../war_server";
import { PLJoinedLobby } from "./lobby/pl_joined_lobby";
import { PLLeftLobby } from "./lobby/pl_left_lobby";
import { PLLobbies } from "./lobby/pl_lobbies";


export const registerPacketListeners = (socket: GameSocket, server: WarServer) => {
    return [
        // lobby
        new PLLobbies(socket, server),
        new PLJoinedLobby(socket, server),
        new PLLeftLobby(socket, server)
    ];
}