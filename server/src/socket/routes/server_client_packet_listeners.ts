import { type Constructor } from '../../@types/utils';
import { ConfigManager } from '../../config/config_manager';
import { CryptManager } from '../../crypt/crypt_manager';
import { GameServer } from '../../game/game_server';
import { Player } from '../../game/player/player';
import { Logger } from '../../log/logger';
import { PLGameAction } from './game/pl_game_action';
import { PLGMoveOnGame } from './game/pl_move_on_game';
import { PLGPause } from './game/pl_pause';
import { PLPing } from './game/pl_ping';
import { PLReconnectToGame } from './game/pl_reconnect_to_game';
import { PLGResume } from './game/pl_resume';
import { PLGSave } from './game/pl_save';
import { PLGSaveAndQuit } from './game/pl_save_and_quit';
import { PLSelectStartingTerritory } from './game/pl_select_starting_territory';
import { PLCancelGameStart } from './lobby/pl_cancel_game_start';
import { PLChatMessage } from './lobby/pl_chat_message';
import { PLDeselectParty } from './lobby/pl_deselect_party';
import { PLKickPlayer } from './lobby/pl_kick_player';
import { PLLeaveLobby } from './lobby/pl_leave_lobby';
import { PLModifyLobbyState } from './lobby/pl_modify_lobby_state';
import { PLSelectParty } from './lobby/pl_select_party';
import { PLStartGame } from './lobby/pl_start_game';
import { PLTransferLobbyOwnership } from './lobby/pl_transfer_lobby_ownership';
import { PLCreateLobby } from './lobby_list/pl_create_lobby';
import { PLJoinLobby } from './lobby_list/pl_join_lobby';
import { PLRequestLobbies } from './lobby_list/pl_req_lobbies';
import { PacketListener } from './packet_listener';
import { type SocketRouteData } from './socket_route_data';

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
