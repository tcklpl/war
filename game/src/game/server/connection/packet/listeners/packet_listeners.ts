import { GameSocket } from "../../../../../@types/socket";
import { WarServer } from "../../../war_server";
import { PLChat } from "./lobby/pl_chat";
import { PLGameStartCancelled } from "./lobby/pl_game_start_cancelled";
import { PLJoinedLobby } from "./lobby/pl_joined_lobby";
import { PLLeftLobby } from "./lobby/pl_left_lobby";
import { PLLobbies } from "./lobby/pl_lobbies";
import { PLStartingGame } from "./lobby/pl_starting_game";
import { PLUpdateLobbyState } from "./lobby/pl_update_lobby_state";


export const registerPacketListeners = (socket: GameSocket, server: WarServer) => {
    return [
        // lobby list
        new PLLobbies(socket, server),

        // lobby
        new PLJoinedLobby(socket, server),
        new PLLeftLobby(socket, server),
        new PLUpdateLobbyState(socket, server),
        new PLChat(socket, server),
        new PLStartingGame(socket, server),
        new PLGameStartCancelled(socket, server),
    ];
}