import { LobbyListStateLobby, PktSvServerLobbies } from "../../../../../protocol";
import { CfgServer } from "../../../config/default/cfg_server";
import { LobbyManager } from "../../../game/lobby/lobby_manager";
import { ServerPacket } from "../server_packet";

export class ServerPacketLobbies extends ServerPacket {

    constructor(gameRoomManager: LobbyManager, serverCfg: CfgServer) {

        const roomList: PktSvServerLobbies = {
            state: {
                max_lobbies: serverCfg.max_lobbies,
                lobbies: gameRoomManager.lobbies.map(room => <LobbyListStateLobby>{
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