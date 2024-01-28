import { LobbyListStateLobby, PktSvServerLobbies } from "../../../../../protocol";
import { CfgServer } from "../../../config/default/cfg_server";
import { GameRoomManager } from "../../../game/room/game_room_manager";
import { ServerPacket } from "../server_packet";

export class ServerPacketLobbies extends ServerPacket {

    constructor(gameRoomManager: GameRoomManager, serverCfg: CfgServer) {

        const roomList: PktSvServerLobbies = {
            state: {
                max_lobbies: serverCfg.max_lobbies,
                lobbies: gameRoomManager.rooms.map(room => <LobbyListStateLobby>{
                    name: room.name,
                    owner_name: room.owner.username,
                    player_count: room.players.length,
                    joinable: room.joinable
                })
            }
        };
        super("lobbies", [roomList]);
    }

}