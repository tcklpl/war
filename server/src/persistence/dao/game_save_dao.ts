import { DataSource, Repository } from 'typeorm';
import { GameSave } from '../model/game_save';

export class GameSaveDao {
    private readonly _repo: Repository<GameSave>;

    constructor(ds: DataSource) {
        this._repo = ds.getRepository(GameSave);
    }

    async save(gs: GameSave) {
        return await this._repo.save(gs);
    }

    async findById(id: string) {
        return await this._repo.findOne({
            where: {
                id: id,
            },
            relations: {
                players: true,
            },
        });
    }

    async findByOwnerName(ownerName: string) {
        return await this._repo.find({
            where: {
                players: {
                    username: ownerName,
                },
            },
            relations: {
                players: true,
            },
        });
    }
}
