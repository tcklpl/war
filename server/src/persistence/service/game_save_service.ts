import { Game } from '../../game/ingame/game';
import { GameSaveDao } from '../dao/game_save_dao';
import { GamePlayerSave } from '../model/game_player_save';
import { GameSave } from '../model/game_save';
import { PersistenceManager } from '../persistence_manager';

export class GameSaveService {
    private _gsDao: GameSaveDao;

    constructor(pm: PersistenceManager) {
        this._gsDao = pm.dao.gameSave;
    }

    private generateSaveFromGame(g: Game) {
        const gameSave = new GameSave();
        const gsPlayers = g.players.map(p => new GamePlayerSave().fromGamePlayerAndGameSave(p, gameSave));
        gameSave.players = gsPlayers;
        gameSave.id = g.id;
        return gameSave;
    }

    async save(game: Game) {
        this._gsDao.save(this.generateSaveFromGame(game));
    }
}
