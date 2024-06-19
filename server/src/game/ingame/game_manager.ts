import { ConfigManager } from '../../config/config_manager';
import { CfgGame } from '../../config/default/cfg_game';
import { CryptManager } from '../../crypt/crypt_manager';
import { Logger } from '../../log/logger';
import { GameServer } from '../game_server';
import { Lobby } from '../lobby/lobby';
import { GamePlayer } from '../player/game_player';
import { Game } from './game';

export class GameManager {
    private _games: Game[] = [];
    private _cfgGame: CfgGame;

    constructor(
        private _configManager: ConfigManager,
        private _cryptManager: CryptManager,
        private _gameServer: GameServer,
        private _log: Logger,
    ) {
        this._cfgGame = _configManager.getConfig(CfgGame);
        this.registerEvents();
    }

    private registerEvents() {
        this._gameServer.playerManager.onPlayerLogoff(p => {
            if (p instanceof GamePlayer) {
                p.online = false;
                // TODO: Logic when a player leaves during a game
            }
        });
    }

    /**
     * Consummates a Lobby into a Game.
     *
     * * This function already removes the lobby from the lobby manager.
     *
     * @param lobby The lobby to be consummated into a game.
     * @param logger Instance of a logger to be used within the game.
     * @returns The created Game.
     */
    consummateLobbyIntoGame(lobby: Lobby, logger: Logger) {
        const game = new Game(lobby, this._cryptManager, logger);
        this._gameServer.lobbyManager.dropLobby(lobby);
        this._games.push(game);
        return game;
    }
}