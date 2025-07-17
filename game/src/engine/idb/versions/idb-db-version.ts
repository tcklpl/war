export interface IDBDBVersion {
	version: number;
	migrate(db: IDBDatabase): void;
}
