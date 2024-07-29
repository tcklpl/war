import { Game } from '../../game/ingame/game';
import { GameSaveDao } from '../dao/game_save_dao';
import { GameSave } from '../model/game_save';
import { PersistenceManager } from '../persistence_manager';

export class GameSaveService {
    private _gsDao: GameSaveDao;

    constructor(pm: PersistenceManager) {
        this._gsDao = pm.dao.gameSave;
    }

    async save(game: Game) {
        this._gsDao.save(new GameSave().fromGame(game));
    }
}
