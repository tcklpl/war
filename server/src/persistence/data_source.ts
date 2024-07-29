import { DataSource } from 'typeorm';
import { GameSave } from './model/game_save';
import { GamePlayerSave } from './model/game_player_save';

export const ServerDataSource = new DataSource({
    type: 'sqlite',
    database: process.cwd() + '/gamedata.db',
    synchronize: true,
    entities: [GameSave, GamePlayerSave],
});
