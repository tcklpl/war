import { GameSocket } from "../../../../../@types/socket";
import { WarServer } from "../../../war_server";
import { PLRoomList } from "./lobby/pl_room_list";


export const registerPacketListeners = (socket: GameSocket, server: WarServer) => {
    return [
        // lobby
        new PLRoomList(socket, server)
    ];
}