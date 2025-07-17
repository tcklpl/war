import type { ConfigManager } from '../../config/config-manager';
import { CfgGame } from '../../config/default/cfg-game';
import type { CryptManager } from '../../crypt/crypt-manager';
import type { Logger } from '../../log/logger';
import type { PersistenceManager } from '../../persistence/persistence-manager';
import type { GameServer } from '../game-server';
import type { Lobby } from '../lobby/lobby';
import { GamePlayer } from '../player/game-player';
import { Game } from './game';

export class GameManager {
	private _games: Game[] = [];
	private readonly _cfgGame: CfgGame;

	constructor(
		private readonly _configManager: ConfigManager,
		private readonly _cryptManager: CryptManager,
		private readonly _gameServer: GameServer,
		private readonly _persistenceManager: PersistenceManager,
		private readonly _log: Logger,
	) {
		this._cfgGame = _configManager.getConfig(CfgGame);
		this.registerEvents();
	}

	private registerEvents() {
		this._gameServer.playerManager.onPlayerLogoff(p => {
			if (p instanceof GamePlayer) {
				p.game.onPlayerLeave(p);
			}
		});
	}

	getGameById(id: string) {
		return this._games.find(g => g.id === id);
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
		const game = new Game(
			lobby,
			this,
			this._cryptManager,
			this._gameServer.playerManager,
			this._persistenceManager.services.gameSave,
			logger,
		);
		this._gameServer.lobbyManager.dropLobby(lobby);
		this._games.push(game);
		return game;
	}

	/**
	 * Removes a game from the manager, meant to be called when a game room is closed.
	 *
	 * @param game The game to be removed.
	 */
	removeGame(game: Game) {
		this._games = this._games.filter(x => x !== game);
	}
}
