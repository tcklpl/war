import { IDBDBVersion } from './idb_db_version';

export class IDBv1AssetCache implements IDBDBVersion {
    version = 1;

    migrate(db: IDBDatabase): void {
        db.createObjectStore('asset-cache', { keyPath: 'name' });
    }
}
