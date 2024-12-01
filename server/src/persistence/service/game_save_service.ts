import { Game } from '../../game/ingame/game';
import { GameSaveDao } from '../dao/game_save_dao';
import { PersistenceManager } from '../persistence_manager';

export class GameSaveService {
    private readonly _gsDao: GameSaveDao;

    constructor(pm: PersistenceManager) {
        this._gsDao = pm.dao.gameSave;
    }

    async save(_game: Game) {
        // TODO: save
    }
}
