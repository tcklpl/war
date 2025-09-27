import type { IDBConnector } from '../../persistence/idb/idb-connector';
import { IDBController } from '../../persistence/idb/idb-controller';
import type { ServerListSelectInfo } from './server-list-select-info';

export class ServerListStorage extends IDBController<ServerListSelectInfo> {
	constructor(connection: IDBConnector) {
		super(connection, {
			name: 'servers',
			keyPath: 'id',
		});
	}
}
