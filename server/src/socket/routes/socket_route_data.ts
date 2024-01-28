import { GameSocket } from "../../@types/server_socket";
import { ConfigManager } from "../../config/config_manager";
import { GameServer } from "../../game/game_server";
import { Player } from "../../game/player/player";

export interface SocketRouteData {
    socket: GameSocket;
    gameServer: GameServer;
    player: Player;

    configManager: ConfigManager;
}