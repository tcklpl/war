import type { Constructor } from '../../@types/utils';
import type { ConfigManager } from '../../config/config-manager';
import type { CryptManager } from '../../crypt/crypt-manager';
import type { GameServer } from '../../game/game-server';
import type { Player } from '../../game/player/player';
import type { Logger } from '../../log/logger';
import { PLGameAction } from './game/pl-game-action';
import { PLGMoveOnGame } from './game/pl-move-on-game';
import { PLGPause } from './game/pl-pause';
import { PLPing } from './game/pl-ping';
import { PLReconnectToGame } from './game/pl-reconnect-to-game';
import { PLGResume } from './game/pl-resume';
import { PLGSave } from './game/pl-save';
import { PLGSaveAndQuit } from './game/pl-save-and-quit';
import { PLSelectStartingTerritory } from './game/pl-select-starting-territory';
import { PLCancelGameStart } from './lobby/pl-cancel-game-start';
import { PLChatMessage } from './lobby/pl-chat-message';
import { PLDeselectParty } from './lobby/pl-deselect-party';
import { PLKickPlayer } from './lobby/pl-kick-player';
import { PLLeaveLobby } from './lobby/pl-leave-lobby';
import { PLModifyLobbyState } from './lobby/pl-modify-lobby-state';
import { PLSelectParty } from './lobby/pl-select-party';
import { PLStartGame } from './lobby/pl-start-game';
import { PLTransferLobbyOwnership } from './lobby/pl-transfer-lobby-ownership';
import { PLCreateLobby } from './lobby-list/pl-create-lobby';
import { PLJoinLobby } from './lobby-list/pl-join-lobby';
import { PLRequestLobbies } from './lobby-list/pl-req-lobbies';
import type { PacketListener } from './packet-listener';
import type { SocketRouteData } from './socket-route-data';

export class ServerClientPacketListeners {
	private readonly _routeData: SocketRouteData;
	private _active = true;

	constructor(
		private readonly _player: Player,
		gameServer: GameServer,
		configManager: ConfigManager,
		cryptManager: CryptManager,
		private readonly _logger: Logger,
	) {
		this._routeData = {
			player: _player,
			socket: _player.connection.socket,
			gameServer,
			configManager,
			cryptManager,
			logger: _logger,
		};
		this.initializePacketListeners();
	}

	private initializePacketListeners() {
		this._packetListeners = this._packetListenerRegistry.map(registry => new registry(this._routeData));
	}

	updatePlayerInstance(newPlayer: Player) {
		this._routeData.player = newPlayer;
		this._routeData.socket = newPlayer.connection.socket;
	}

	unregisterPacketListeners() {
		this._player.connection.socket.offAny();
		this._active = false;
	}

	private readonly _packetListenerRegistry: Constructor<PacketListener>[] = [
		// Lobby List
		PLCreateLobby,
		PLJoinLobby,
		PLRequestLobbies,

		// Lobby
		PLChatMessage,
		PLSelectParty,
		PLLeaveLobby,
		PLDeselectParty,
		PLKickPlayer,
		PLModifyLobbyState,
		PLTransferLobbyOwnership,
		PLStartGame,
		PLCancelGameStart,

		// Game
		PLPing,
		PLSelectStartingTerritory,
		PLGameAction,
		PLReconnectToGame,

		PLGPause,
		PLGResume,
		PLGSave,
		PLGSaveAndQuit,
		PLGMoveOnGame,
	];

	private _packetListeners: PacketListener[] = [];

	get player() {
		return this._player;
	}

	get active() {
		return this._active;
	}
}
