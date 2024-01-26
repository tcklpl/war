import { PktSvServerRoomList, ServerRoomListStateRoom } from "../../../../../protocol";
import { GameRoomManager } from "../../../game/room/game_room_manager";
import { ServerPacket } from "../server_packet";

export class ServerPacketRoomList extends ServerPacket {

    constructor(gameRoomManager: GameRoomManager) {

        const roomList: PktSvServerRoomList = {
            state: {
                max_rooms: gameRoomManager.rooms.length,
                rooms: gameRoomManager.rooms.map(room => <ServerRoomListStateRoom>{
                    name: room.name,
                    owner_name: room.owner.username,
                    player_count: room.players.length,
                    joinable: room.joinable
                })
            }
        };
        super("roomList", [roomList]);
    }

}