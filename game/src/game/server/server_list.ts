import { IDBConnector } from ':engine/idb/idb_connector';
import { ServerListSelectInfo } from './server_list_select_info';
import { ServerListStorage } from './server_list_storage';

export class ServerList {
    private _serverStorage!: ServerListStorage;

    async initializeDB(connection: IDBConnector) {
        this._serverStorage = new ServerListStorage(connection);
    }

    async getAllServers() {
        return await this._serverStorage.getAll();
    }

    async addServer(name: string, address: string) {
        const uuid = crypto.randomUUID();
        const listEndPosition = await this._serverStorage.count();
        const newServerInfo = {
            id: uuid,
            localName: name,
            address: address,
            listPosition: listEndPosition,
        } as ServerListSelectInfo;
        await this._serverStorage.put(newServerInfo);
        return newServerInfo;
    }

    async editServer(server: ServerListSelectInfo) {
        await this._serverStorage.put(server);
    }

    async deleteServer(uuid: string) {
        await this._serverStorage.deleteKey(uuid);
        await this.updateListPositions();
    }

    async updateListPositions() {
        const servers = (await this.getAllServers()).sort((a, b) => a.listPosition - b.listPosition);
        let i = 0;
        for (const server of servers) {
            server.listPosition = i;
            await this.editServer(server);
            i++;
        }
    }
}
