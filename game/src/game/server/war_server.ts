import { LobbyListState } from '../../../../protocol';
import { WarGameLobby } from '../lobby/war_game_lobby';
import { registerPacketListeners } from './connection/packet/listeners/packet_listeners';
import { ClientPacketCreateLobby } from './connection/packet/to_send/lobby_list/create_lobby';
import { ClientPacketJoinLobby } from './connection/packet/to_send/lobby_list/join_lobby';
import { ClientPacketRequireLobbies } from './connection/packet/to_send/lobby_list/req_lobbies';
import { ServerConnection } from './connection/server_connection';
import { ListenableProperty } from './listenable_property';

export class WarServer {
    private _lobbies = new ListenableProperty<LobbyListState>();
    private _currentLobby = new ListenableProperty<WarGameLobby>();
    private _lastLobbyExitReason = new ListenableProperty<'left' | 'kicked' | ''>('');

    constructor(private _connection: ServerConnection) {
        registerPacketListeners(_connection.socket, this);
    }

    cleanup() {
        this._currentLobby.value?.cleanup();
    }

    requestLobbies() {
        new ClientPacketRequireLobbies().dispatch();
    }

    createLobby(name: string, joinable: boolean) {
        new ClientPacketCreateLobby(name, joinable).dispatch();
    }

    joinLobby(name: string) {
        new ClientPacketJoinLobby(name).dispatch();
    }

    get connection() {
        return this._connection;
    }

    get lobbies() {
        return this._lobbies;
    }

    get currentLobby() {
        return this._currentLobby;
    }

    get lastLobbyExitReason() {
        return this._lastLobbyExitReason;
    }
}
