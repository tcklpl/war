import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameSave } from './game_save';
import { GameParty } from '../../../../protocol';
import { GamePlayer } from '../../game/player/game_player';

@Entity()
export class GamePlayerSave {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @ManyToOne(() => GameSave, game => game.players)
    game!: GameSave;

    @Column()
    owner!: boolean;

    @Column({ type: 'varchar' })
    party!: GameParty;

    fromGamePlayerAndGameSave(gp: GamePlayer, gs: GameSave) {
        this.username = gp.username;
        this.game = gs;
        this.owner = gp.game.isOwner(gp);
        this.party = gp.party.protocolValue;
        return this;
    }
}
