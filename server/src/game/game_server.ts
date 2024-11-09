import { ConfigManager } from '../config/config_manager';
import { CryptManager } from '../crypt/crypt_manager';
import { Logger } from '../log/logger';
import { PersistenceManager } from '../persistence/persistence_manager';
import { GameManager } from './ingame/game_manager';
import { LobbyManager } from './lobby/lobby_manager';
import { PlayerManager } from './player/player_manager';

export class GameServer {
    private readonly _playerManager!: PlayerManager;
    private _lobbyManager!: LobbyManager;
    private _gameManager!: GameManager;

    constructor(
        private readonly _configManager: ConfigManager,
        private readonly _cryptManager: CryptManager,
        private readonly _persistenceManager: PersistenceManager,
        private readonly _log: Logger,
    ) {
        this._playerManager = new PlayerManager(this._log.createChildContext('Player Manager'));
    }

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
