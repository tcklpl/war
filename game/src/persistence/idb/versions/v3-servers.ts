import type { IDBDBVersion } from './idb-db-version';

export class IDBv3Servers implements IDBDBVersion {
	version = 3;

	migrate(db: IDBDatabase): void {
		db.createObjectStore('servers', { keyPath: 'id' });
	}
}
