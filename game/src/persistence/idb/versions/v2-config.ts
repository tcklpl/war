import type { IDBDBVersion } from './idb-db-version';

export class IDBv2Config implements IDBDBVersion {
	version = 2;

	migrate(db: IDBDatabase): void {
		db.createObjectStore('config', { keyPath: 'page' });
	}
}
