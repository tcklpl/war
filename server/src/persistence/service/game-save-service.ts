import type { Game } from '../../game/ingame/game';
import type { GameSaveDao } from '../dao/game-save-dao';
import type { PersistenceManager } from '../persistence-manager';

export class GameSaveService {
	private readonly _gsDao: GameSaveDao;

	constructor(pm: PersistenceManager) {
		this._gsDao = pm.dao.gameSave;
	}

	async save(_game: Game) {
		// TODO: save
	}
}
