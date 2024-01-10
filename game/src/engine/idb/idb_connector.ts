import { IDBStatus } from "./idb_status";
import { IDBVersionMigrator } from "./idb_version_migrator";

export class IDBConnector {

    private _versionMigrator = new IDBVersionMigrator();
    private _status = IDBStatus.STARTING;
    private _db?: IDBDatabase;

    constructor(private _dbName: string, private _dbVersion: number) {
        // if the browser doesn't support indexedDB
        if (!indexedDB) {
            this._status = IDBStatus.NOT_SUPPORTED;
            return;
        }
    }

    openConnection() {
        return new Promise<void>((resolve, reject) => {
            if (!this.isSupported) return resolve();

            const openRequest = indexedDB.open(this._dbName, this._dbVersion);
            
            openRequest.onupgradeneeded = e => {
                this._db = openRequest.result;
                const oldVersion = e.oldVersion;
                this._versionMigrator.assertLatestMigration(this._db, oldVersion);
            }

            openRequest.onsuccess = () => {
                this._db = openRequest.result;
                this._status = IDBStatus.OPEN;
                resolve();
            }

            openRequest.onerror = () => {
                this._status = IDBStatus.ERROR;
                reject(openRequest.error);
            }
        });
    }

    closeConnection() {
        return new Promise<void>((res, rej) => {
            if (!this.db) return rej();
            this.db.onclose = () => res();
            this.db.close();
        });
    }

    get isSupported() {
        return this._status !== IDBStatus.NOT_SUPPORTED;
    }

    get isAvailable() {
        return !!this._db;
    }

    get db() {
        return this._db;
    }
}