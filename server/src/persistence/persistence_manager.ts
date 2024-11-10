import fs from 'fs';
import { DataSource } from 'typeorm';
import { Logger } from '../log/logger';
import { GameSaveDao } from './dao/game_save_dao';
import { createDataSourceForDriver } from './data_source';
import { GameSaveService } from './service/game_save_service';

export class PersistenceManager {
    private readonly _sqlFilePath = process.cwd() + '/gamedata.db';
    private _dataSource!: DataSource;

    private _dao!: {
        gameSave: GameSaveDao;
    };

    private _services!: {
        gameSave: GameSaveService;
    };

    constructor(private readonly _log: Logger) {}

    async initialize() {
        this._log.info('Initializing');

        this._log.trace('Initializing DB');
        this._dataSource = await createDataSourceForDriver(this.loadDbFile(), data =>
            this.saveLocalDb(data),
        ).initialize();

        this._log.trace('Initializing DAOs');
        this._dao = {
            gameSave: new GameSaveDao(this._dataSource),
        };

        this._log.trace('Initializing Services');
        this._services = {
            gameSave: new GameSaveService(this),
        };

        this._log.info('Initialized');
    }

    private loadDbFile() {
        if (fs.existsSync(this._sqlFilePath)) {
            this._log.trace('Local DB found! loading it');
            return fs.readFileSync(this._sqlFilePath);
        }
        this._log.trace('Local DB not found');
    }

    private saveLocalDb(data: Uint8Array) {
        this._log.trace('Saving local DB');
        fs.writeFileSync(this._sqlFilePath, data);
    }

    get dao() {
        return this._dao;
    }

    get services() {
        return this._services;
    }
}
