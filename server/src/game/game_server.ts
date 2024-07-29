import { ConfigManager } from '../config/config_manager';
import { CryptManager } from '../crypt/crypt_manager';
import { PlayerManager } from './player/player_manager';
import { LobbyManager } from './lobby/lobby_manager';
import { Logger } from '../log/logger';
import { GameManager } from './ingame/game_manager';
import { PersistenceManager } from '../persistence/persistence_manager';

export class GameServer {
    private _playerManager = new PlayerManager(this._log.createChildContext('Player Manager'));

    private _lobbyManager!: LobbyManager;
    private _gameManager!: GameManager;

    constructor(
        private _configManager: ConfigManager,
        private _cryptManager: CryptManager,
        private _persistenceManager: PersistenceManager,
        private _log: Logger,
    ) {}

    async initialize() {
        this._log.info('Game server started');
        this._lobbyManager = new LobbyManager(this._configManager, this, this._log.createChildContext('Lobby Manager'));
        this._gameManager = new GameManager(
            this._configManager,
            this._cryptManager,
            this,
            this._persistenceManager,
            this._log.createChildContext('Game Manager'),
        );
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

    get gameManager() {
        return this._gameManager;
    }
}
