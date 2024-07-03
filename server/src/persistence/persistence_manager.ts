import { DataSource } from 'typeorm';
import { Logger } from '../log/logger';
import { ServerDataSource } from './data_source';
import { GameSaveDao } from './dao/game_save_dao';
import { GameSaveService } from './service/game_save_service';

export class PersistenceManager {
    private _dataSource!: DataSource;

    private _dao!: {
        gameSave: GameSaveDao;
    };

    private _services!: {
        gameSave: GameSaveService;
    };

    constructor(private _log: Logger) {}

    async initialize() {
        this._log.info('Initializing');
        this._log.trace('Initializing DB');
        this._dataSource = await ServerDataSource.initialize();
        this._log.trace('DB Initialized');
        this._log.trace('Initializing DAOs');
        this._dao = {
            gameSave: new GameSaveDao(this._dataSource),
        };
        this._log.trace('DAOs Initialized');
        this._log.trace('Initializing Services');
        this._services = {
            gameSave: new GameSaveService(this),
        };
        this._log.trace('Services Initialized');
        this._log.info('Initialized');
    }

    get dao() {
        return this._dao;
    }

    get services() {
        return this._services;
    }
}