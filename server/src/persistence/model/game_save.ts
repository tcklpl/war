import { Game } from '../../game/ingame/game';
import { GamePlayerSave } from './game_player_save';

export class GameSave {
    id!: string;
    players!: GamePlayerSave[];

    fromGame(game: Game) {
        this.id = game.id;
        this.players = game.players.map(p => new GamePlayerSave().fromGamePlayerAndGameSave(p, this));
        return this;
    }
}
