import { ReactStateSetters } from './react_state_setters';
import { ServerConnection } from './server/connection/server_connection';
import { ServerList } from './server/server_list';
import { WarServer } from './server/war_server';

export class GameStateManager {
    private _serverList = new ServerList();
    private _currentServer?: WarServer;
    readonly reactState = new ReactStateSetters();

    async initialize() {
        await this._serverList.initializeDB(game.engine.db);
    }

    cleanup() {
        this._currentServer?.cleanup();
    }

    connectToServer(target: ServerConnection) {
        this._currentServer = new WarServer(target);
        this.reactState.useGameSession.setConnection(target);
    }

    get serverList() {
        return this._serverList;
    }

    get server() {
        return this._currentServer;
    }
}
