import { LobbyListState } from '../../../../protocol';
import { WarGameLobby } from '../lobby/war_game_lobby';
import { registerPacketListeners } from './connection/packet/listeners/packet_listeners';
import { ClientPacketCreateLobby } from './connection/packet/to_send/lobby_list/create_lobby';
import { ClientPacketJoinLobby } from './connection/packet/to_send/lobby_list/join_lobby';
import { ClientPacketRequireLobbies } from './connection/packet/to_send/lobby_list/req_lobbies';
import { ServerConnection } from './connection/server_connection';

export class WarServer {
    private _lobbies?: LobbyListState;
    private _currentLobby?: WarGameLobby;
    private _lastLobbyExitReason: 'left' | 'kicked' | '' = '';

    constructor(private _connection: ServerConnection) {
        registerPacketListeners(_connection.socket, this);
    }

    cleanup() {
        this._currentLobby?.cleanup();
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

    set lobbies(l: LobbyListState | undefined) {
        this._lobbies = l;
        game.state.reactState.useGameSession.setLobbies(l);
    }

    get currentLobby() {
        return this._currentLobby;
    }

    set currentLobby(l: WarGameLobby | undefined) {
        this._currentLobby = l;
        game.state.reactState.useGameSession.setCurrentLobby(l);
    }

    get lastLobbyExitReason() {
        return this._lastLobbyExitReason;
    }

    set lastLobbyExitReason(reason: 'left' | 'kicked' | '') {
        this._lastLobbyExitReason = reason;
        game.state.reactState.useGameSession.updateForLobbyExit(reason);
    }
}
