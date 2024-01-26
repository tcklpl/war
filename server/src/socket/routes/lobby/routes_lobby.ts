import { GameSocket } from "../../../@types/server_socket";
import { GameServer } from "../../../game/game_server";
import { Player } from "../../../game/player/player";
import { socketRoutesLobbyRequireRoomList } from "./req_room_list";

export const socketRoutesLobby = (socket: GameSocket, gameServer: GameServer,  player: Player) => {

    socketRoutesLobbyRequireRoomList(socket, gameServer, player);

}