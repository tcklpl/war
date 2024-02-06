import { ServerConnection } from "./server/connection/server_connection";
import { ServerList } from "./server/server_list";
import { WarServer } from "./server/war_server";

export class GameStateManager {

    private _serverList = new ServerList();
    private _currentServer?: WarServer;
    private _serverConnectionChangeListeners: ((connection?: WarServer) => void)[] = [];

    async initialize() {
        await this._serverList.initializeDB(game.engine.db);
    }

    connectToServer(target: ServerConnection) {
        this._currentServer = new WarServer(target);
        this._serverConnectionChangeListeners.forEach(l => l(this._currentServer));
    }

    onServerConnectionChange(listener: (connection?: WarServer) => void) {
        this._serverConnectionChangeListeners.push(listener);
    }

    get serverList() {
        return this._serverList;
    }

    get server() {
        return this._currentServer;
    }

}