import { IDBConnector } from './idb/idb_connector';

export class IDBWarConnection extends IDBConnector {
    constructor() {
        super('war', 3);
    }

    async initialize() {
        await this.openConnection();
    }
}
