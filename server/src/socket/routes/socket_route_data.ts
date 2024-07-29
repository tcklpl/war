import { GameSocket } from '../../@types/server_socket';
import { ConfigManager } from '../../config/config_manager';
import { CryptManager } from '../../crypt/crypt_manager';
import { GameServer } from '../../game/game_server';
import { Player } from '../../game/player/player';
import { Logger } from '../../log/logger';

export interface SocketRouteData {
    player: Player;
    socket: GameSocket;

    gameServer: GameServer;
    configManager: ConfigManager;
    cryptManager: CryptManager;
    logger: Logger;
}
