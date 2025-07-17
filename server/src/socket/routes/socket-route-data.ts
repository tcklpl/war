import type { GameSocket } from '../../@types/server-socket';
import type { ConfigManager } from '../../config/config-manager';
import type { CryptManager } from '../../crypt/crypt-manager';
import type { GameServer } from '../../game/game-server';
import type { Player } from '../../game/player/player';
import type { Logger } from '../../log/logger';

export interface SocketRouteData {
	player: Player;
	socket: GameSocket;

	gameServer: GameServer;
	configManager: ConfigManager;
	cryptManager: CryptManager;
	logger: Logger;
}
