import { IDBv1AssetCache } from "./versions/v1_asset_cache";

export class IDBVersionMigrator {
    
    private _versions = [
        new IDBv1AssetCache()
    ];

    assertLatestMigration(db: IDBDatabase, oldVersion: number) {
        this._versions.forEach(v => {
            if (oldVersion < v.version) v.migrate(db);
        });
    }
}