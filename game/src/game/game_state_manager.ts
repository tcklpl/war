import { ReactStateSetters } from './react_state_setters';
import { ReconnectionInfo } from './server/connection/reconnection_info';
import { ServerConnection } from './server/connection/server_connection';
import { ServerConnectionCandidate } from './server/connection/server_connection_candidate';
import { ServerList } from './server/server_list';
import { WarServer } from './server/war_server';

export class GameStateManager {
    static readonly INSTANCE = new GameStateManager();

    private readonly _serverList = new ServerList();
    private _currentServer?: WarServer;
    readonly reactState = new ReactStateSetters();

    // No instantiation
    private constructor() {}

    async initialize() {
        await this._serverList.initializeDB(game.engine.db);
    }

    cleanup() {
        this._currentServer?.cleanup();
    }

    setActiveServerConnection(target: ServerConnection | undefined) {
        if (target) this._currentServer = new WarServer(target);
        else this._currentServer = undefined;
        this.reactState.useGameSession.setConnection(target);
    }

    async reconnectToServer(reconnectionInfo: ReconnectionInfo) {
        const candidate = new ServerConnectionCandidate(reconnectionInfo.serverIp);
        await candidate.ping();
        const connection = await candidate.connect(reconnectionInfo.serverAuthToken);
        if (!connection) return false;
        this.setActiveServerConnection(connection);
        return true;
    }

    disconnectFromCurrentServer() {
        this._currentServer?.disconnect();
        this.setActiveServerConnection(undefined);
    }

    get serverList() {
        return this._serverList;
    }

    get server() {
        return this._currentServer;
    }
}
