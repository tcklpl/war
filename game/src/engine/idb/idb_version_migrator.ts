import { IDBv1AssetCache } from './versions/v1_asset_cache';
import { IDBv2Config } from './versions/v2_config';
import { IDBv3Servers } from './versions/v3_servers';

export class IDBVersionMigrator {
    private _versions = [new IDBv1AssetCache(), new IDBv2Config(), new IDBv3Servers()];

    assertLatestMigration(db: IDBDatabase, oldVersion: number) {
        this._versions.forEach(v => {
            if (oldVersion < v.version) v.migrate(db);
        });
    }
}
