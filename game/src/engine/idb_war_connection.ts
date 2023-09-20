import { IDBConnector } from "./idb/idb_connector";

export class IDBWarConnection extends IDBConnector {

    constructor() {
        super('war', 1);
    }

    async initialize() {
        await this.openConnection();
    }

}