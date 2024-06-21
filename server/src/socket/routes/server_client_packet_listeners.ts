import { PLChatMessage } from './lobby/pl_chat_message';
import { PLCreateLobby } from './lobby_list/pl_create_lobby';
import { PLDeselectParty } from './lobby/pl_deselect_party';
import { PLJoinLobby } from './lobby_list/pl_join_lobby';
import { PLKickPlayer } from './lobby/pl_kick_player';
import { PLLeaveLobby } from './lobby/pl_leave_lobby';
import { PLModifyLobbyState } from './lobby/pl_modify_lobby_state';
import { PLRequestLobbies } from './lobby_list/pl_req_lobbies';
import { PLSelectParty } from './lobby/pl_select_party';
import { PLTransferLobbyOwnership } from './lobby/pl_transfer_lobby_ownership';
import { SocketRouteData } from './socket_route_data';
import { PLStartGame } from './lobby/pl_start_game';
import { PLCancelGameStart } from './lobby/pl_cancel_game_start';
import { PLGameAction } from './game/pl_game_action';
import { PLSelectStartingTerritory } from './game/pl_select_starting_territory';
import { Logger } from '../../log/logger';
import { PLPing } from './game/pl_ping';
import { Player } from '../../game/player/player';
import { GameServer } from '../../game/game_server';
import { ConfigManager } from '../../config/config_manager';
import { PacketListener } from './packet_listener';
import { Constructor } from '../../@types/utils';
import { PLReconnectToGame } from './game/pl_reconnect_to_game';
import { CryptManager } from '../../crypt/crypt_manager';

export class ServerClientPacketListeners {
    private _routeData: SocketRouteData;
    private _active = true;

    constructor(
        private _player: Player,
        gameServer: GameServer,
        configManager: ConfigManager,
        cryptManager: CryptManager,
        private _logger: Logger,
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

    private _packetListenerRegistry: Constructor<PacketListener>[] = [
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
    ];

    private _packetListeners: PacketListener[] = [];

    get player() {
        return this._player;
    }

    get active() {
        return this._active;
    }
}
