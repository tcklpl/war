import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Logger } from '../log/logger';
import { GameSaveDao } from './dao/game_save_dao';
import { GameSaveService } from './service/game_save_service';

export class PersistenceManager {
    private readonly _dbPath = process.cwd() + '/gamedata.db';
    private _sqliteDb!: Database;
    private _db;

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
        this._sqliteDb = new Database(this._dbPath, { create: true });
        this._db = drizzle(this._sqliteDb);

        this._log.trace('Initializing DAOs');
        this._dao = {
            gameSave: new GameSaveDao(),
        };

        this._log.trace('Initializing Services');
        this._services = {
            gameSave: new GameSaveService(this),
        };

        this._log.info('Initialized');
    }

    get dao() {
        return this._dao;
    }

    get services() {
        return this._services;
    }
}
