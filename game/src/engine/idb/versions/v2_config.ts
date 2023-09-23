import { IDBDBVersion } from "./idb_db_version";

export class IDBv2Config implements IDBDBVersion {

    version = 2;

    migrate(db: IDBDatabase): void {
        db.createObjectStore('config', {keyPath: 'page'});
    }
    
}