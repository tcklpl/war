import { GameSocket } from "../../../@types/server_socket";
import { GameServer } from "../../../game/game_server";
import { Player } from "../../../game/player/player";
import { ServerPacketRoomList } from "../../packet/lobby/svpkt_room_list";

export const socketRoutesLobbyRequireRoomList = (socket: GameSocket, gameServer: GameServer, player: Player) => {

    socket.on("requireRoomList", () => {

        const packet = new ServerPacketRoomList(gameServer.gameRoomManager);
        packet.dispatch(player);

    });

}