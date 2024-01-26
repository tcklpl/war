import { GameSocket } from "../../@types/server_socket";
import { GameServer } from "../../game/game_server";
import { Player } from "../../game/player/player";
import { socketRoutesLobby } from "./lobby/routes_lobby";

export const socketRoutes = (socket: GameSocket, gameServer: GameServer, player: Player) => {

    socketRoutesLobby(socket, gameServer, player);

}