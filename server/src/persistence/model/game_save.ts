import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GamePlayerSave } from './game_player_save';
import { Game } from '../../game/ingame/game';

@Entity()
export class GameSave {
    @PrimaryColumn()
    id!: string;

    @OneToMany(() => GamePlayerSave, player => player.game)
    players!: GamePlayerSave[];

    fromGame(game: Game) {
        this.id = game.id;
        this.players = game.players.map(p => new GamePlayerSave().fromGamePlayerAndGameSave(p, this));
        return this;
    }
}
