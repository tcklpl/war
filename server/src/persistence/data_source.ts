import { DataSource } from 'typeorm';
import { GamePlayerSave } from './model/game_player_save';
import { GameSave } from './model/game_save';

export function createDataSourceForDriver(db: Buffer | undefined, saveCallback: (data: Uint8Array) => void) {
    return new DataSource({
        type: 'sqljs',
        database: db,
        synchronize: true,
        autoSave: true,
        autoSaveCallback: saveCallback,
        entities: [GameSave, GamePlayerSave],
    });
}
