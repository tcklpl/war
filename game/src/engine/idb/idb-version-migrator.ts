import { IDBv1AssetCache } from './versions/v1-asset-cache';
import { IDBv2Config } from './versions/v2-config';
import { IDBv3Servers } from './versions/v3-servers';

export class IDBVersionMigrator {
	private readonly _versions = [new IDBv1AssetCache(), new IDBv2Config(), new IDBv3Servers()];

	assertLatestMigration(db: IDBDatabase, oldVersion: number) {
		this._versions.forEach(v => {
			if (oldVersion < v.version) v.migrate(db);
		});
	}
}
