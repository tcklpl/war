import { IDBDBVersion } from "./idb_db_version";

export class IDBv3Servers implements IDBDBVersion {

    version = 3;

    migrate(db: IDBDatabase): void {
        db.createObjectStore('servers', {keyPath: 'id'});
    }
    
}