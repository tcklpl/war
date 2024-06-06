import { IDBConnector } from '../../engine/idb/idb_connector';
import { IDBController } from '../../engine/idb/idb_controller';
import { ServerListSelectInfo } from './server_list_select_info';

export class ServerListStorage extends IDBController<ServerListSelectInfo> {
    constructor(connection: IDBConnector) {
        super(connection, {
            name: 'servers',
            keyPath: 'id',
        });
    }
}
