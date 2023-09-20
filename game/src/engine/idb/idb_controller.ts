import { IDBConnector } from "./idb_connector";

export interface IDBControllerInfo {
    name: string;
    keyPath: string;
}

export class IDBController<T> {

    constructor(private _connection: IDBConnector, private _info: IDBControllerInfo) { }

    private createTransaction(mode: IDBTransactionMode) {
        const transaction = this._connection.db?.transaction(this._info.name, mode);
        return transaction?.objectStore(this._info.name);
    }

    add(value: T) {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.createTransaction('readwrite');
            if (!transaction) return resolve();
            const request = transaction.add(value);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }

    put(value: T) {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.createTransaction('readwrite');
            if (!transaction) return resolve();
            const request = transaction.put(value);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }

    getOne(key: any) {
        return new Promise<T | undefined>((resolve, reject) => {
            const transaction = this.createTransaction('readonly');
            if (!transaction) return resolve(undefined);
            const request = transaction.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject();
        });
    }

    getAll() {
        return new Promise<T[]>((resolve, reject) => {
            const transaction = this.createTransaction('readonly');
            if (!transaction) return resolve([]);
            const request = transaction.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject();
        });
    }

    getAllKeys() {
        return new Promise<any[]>((resolve, reject) => {
            const transaction = this.createTransaction('readonly');
            if (!transaction) return resolve([]);
            const request = transaction.getAllKeys();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject();
        });
    }

    deleteKey(key: any) {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.createTransaction('readwrite');
            if (!transaction) return resolve();
            const request = transaction.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }

    clear() {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.createTransaction('readwrite');
            if (!transaction) return resolve();
            const request = transaction.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject();
        });
    }

}