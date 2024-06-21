import { Logger } from '../log/logger';
import { ServerDataSource } from './data_source';

export class PersistenceManager {
    constructor(private _log: Logger) {}

    async initialize() {
        this._log.info('Initializing DB');
        await ServerDataSource.initialize();
        this._log.info('DB Initialized');
    }
}
