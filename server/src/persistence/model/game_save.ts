import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GamePlayerSave } from './game_player_save';

@Entity()
export class GameSave {
    @PrimaryColumn()
    id!: string;

    @OneToMany(() => GamePlayerSave, player => player.game)
    players!: GamePlayerSave[];
}
