import type { IDBConnector } from ':engine/idb/idb-connector';
import { IDBController } from ':engine/idb/idb-controller';
import type { ServerListSelectInfo } from './server-list-select-info';

export class ServerListStorage extends IDBController<ServerListSelectInfo> {
	constructor(connection: IDBConnector) {
		super(connection, {
			name: 'servers',
			keyPath: 'id',
		});
	}
}
