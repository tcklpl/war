import type { GameParty, LobbyState } from ':protocol';
import { ClientPacketCancelGameStart } from '../server/connection/packet/to-send/lobby/admin/cancel-game-start';
import { ClientPacketKickPlayer } from '../server/connection/packet/to-send/lobby/admin/kick-player';
import { ClientPacketModifyLobbyState } from '../server/connection/packet/to-send/lobby/admin/modify-lobby-state';
import { ClientPacketStartGame } from '../server/connection/packet/to-send/lobby/admin/start-game';
import { ClientPacketTransferLobbyOwnership } from '../server/connection/packet/to-send/lobby/admin/transfer-ownership';
import { ClientPacketDeselectParty } from '../server/connection/packet/to-send/lobby/common/deselect-current-party';
import { ClientPacketLeaveLobby } from '../server/connection/packet/to-send/lobby/common/leave-lobby';
import { ClientPacketSelectParty } from '../server/connection/packet/to-send/lobby/common/select-party';
import { LobbyChat } from './lobby-chat';

export class WarGameLobby {
	private _state?: LobbyState;
	private readonly _chat = new LobbyChat();

	private _gameStartCountdown = 0;
	private _taskGameStartCountdown?: number;

	constructor(state: LobbyState) {
		this._state = state;
	}

	leave() {
		new ClientPacketLeaveLobby().dispatch();
		this.cleanup();
	}

	cleanup() {
		this.cancelGameStartCountdown();
		this._chat.eraseHistory();
	}

	transferOwnership(newOwner: string) {
		new ClientPacketTransferLobbyOwnership(newOwner).dispatch();
	}

	kickPlayer(player: string) {
		new ClientPacketKickPlayer(player).dispatch();
	}

	modifyLobbyState(state: LobbyState) {
		new ClientPacketModifyLobbyState(state).dispatch();
	}

	selectParty(party: GameParty) {
		new ClientPacketSelectParty(party).dispatch();
	}

	deselectCurrentParty() {
		new ClientPacketDeselectParty().dispatch();
	}

	startGame() {
		new ClientPacketStartGame().dispatch();
	}

	cancelGameStart() {
		new ClientPacketCancelGameStart().dispatch();
	}

	setGameStartingCountdown(cd: number) {
		if (this._taskGameStartCountdown) this.cancelGameStartCountdown();

		this.gameStartCountdown = cd;
		const decrease = () => {
			this._taskGameStartCountdown = window.setTimeout(() => {
				if (this.gameStartCountdown > 0) {
					this.gameStartCountdown = this.gameStartCountdown - 1;
					decrease();
				}
			}, 1000);
		};

		decrease();
	}

	cancelGameStartCountdown() {
		clearTimeout(this._taskGameStartCountdown);
		this._gameStartCountdown = 0;
	}

	get state() {
		return this._state;
	}

	set state(s: LobbyState | undefined) {
		this._state = s;
		game.state.reactState.useGameSession.setCurrentLobbyState(s);
	}

	get chat() {
		return this._chat;
	}

	get gameStartCountdown() {
		return this._gameStartCountdown;
	}

	private set gameStartCountdown(cd: number) {
		this._gameStartCountdown = cd;
		game.state.reactState.useGameSession.setGameStartingIn(cd);
	}
}
