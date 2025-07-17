import type { LobbyListState, ReconnectionStatus } from ':protocol';
import type { WarGameLobby } from '../lobby/war-game-lobby';
import type { WarGameSession } from '../lobby/war-game-session';
import { registerPacketListeners } from './connection/packet/listeners/packet-listeners';
import { ClientPacketReconnectToGame } from './connection/packet/to-send/ingame/reconnect';
import { ClientPacketCreateLobby } from './connection/packet/to-send/lobby-list/create-lobby';
import { ClientPacketJoinLobby } from './connection/packet/to-send/lobby-list/join-lobby';
import { ClientPacketRequireLobbies } from './connection/packet/to-send/lobby-list/req-lobbies';
import type { ServerConnection } from './connection/server-connection';

export type LobbyExitReason = 'left' | 'kicked' | 'room closed' | '';

export class WarServer {
	private _lobbies?: LobbyListState;
	private _currentLobby?: WarGameLobby;
	private _currentGameSession?: WarGameSession;
	private _lastLobbyExitReason: LobbyExitReason = '';

	constructor(private readonly _connection: ServerConnection) {
		registerPacketListeners(_connection.socket, this);
	}

	cleanup() {
		this._currentLobby?.cleanup();
		this._currentGameSession?.cleanup();
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

	reconnectToGame(token: string, callback: (status: ReconnectionStatus) => void) {
		new ClientPacketReconnectToGame(token, callback).dispatch();
	}

	disconnect() {
		this._connection.closeConnection();
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

	get currentGameSession() {
		return this._currentGameSession;
	}

	set currentGameSession(s: WarGameSession | undefined) {
		this._currentGameSession = s;
		game.state.reactState.useGameSession.setCurrentGameSession(s);
	}

	get lastLobbyExitReason() {
		return this._lastLobbyExitReason;
	}

	set lastLobbyExitReason(reason: LobbyExitReason) {
		this._lastLobbyExitReason = reason;
		game.state.reactState.useGameSession.updateForLobbyExit(reason);
	}
}
