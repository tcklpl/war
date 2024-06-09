import { ConfigManager } from '../config/config_manager';
import { CryptManager } from '../crypt/crypt_manager';
import { PlayerManager } from './player/player_manager';
import { LobbyManager } from './lobby/lobby_manager';
import { Logger } from '../log/logger';

export class GameServer {
    private _playerManager = new PlayerManager(this._log.createChildContext('Player Manager'));
    private _lobbyManager!: LobbyManager;

    constructor(
        private _configManager: ConfigManager,
        private _cryptManager: CryptManager,
        private _log: Logger,
    ) {}

    async initialize() {
        this._log.info('Game server started');
        this._lobbyManager = new LobbyManager(this._configManager, this, this._log.createChildContext('Lobby Manager'));
    }

    async stop() {
        await this._lobbyManager.stop();
    }

    get playerManager() {
        return this._playerManager;
    }

    get lobbyManager() {
        return this._lobbyManager;
    }
}
