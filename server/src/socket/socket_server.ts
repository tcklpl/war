import { Server } from 'socket.io';
import { ConfigManager } from '../config/config_manager';
import { CfgServer } from '../config/default/cfg_server';
import { CryptManager } from '../crypt/crypt_manager';
import { GameServer } from '../game/game_server';
import { LobbyPlayer } from '../game/player/lobby_player';
import { GameSocketServer } from '../@types/server_socket';
import { Logger } from '../log/logger';
import { PlayerConnection } from '../game/player/player_connection';
import { ServerClientPacketListeners } from './routes/server_client_packet_listeners';
import { AuthTokenBody } from '../../../protocol';

export class SocketServer {
    constructor(
        private _configManager: ConfigManager,
        private _cryptManager: CryptManager,
        private _gameServer: GameServer,
        private _log: Logger,
    ) {}

    private _io!: GameSocketServer;

    private startServer() {
        this._io = new Server({
            cors: {
                origin: '*',
            },
        });
        const serverConfig = this._configManager.getConfig(CfgServer);

        this.registerConnectionEvents();

        this._io.listen(serverConfig.socket_port);
        this._log.info(`Socket Server listening on ${serverConfig.host}:${serverConfig.socket_port}`);
    }

    private registerConnectionEvents() {
        // Authorization: user needs a signed token before starting a connection
        this._io.use((socket, next) => {
            const token: string = socket.handshake.auth.token;
            if (!this._cryptManager.validateToken(token)) return next(new Error('Not Authorized'));
            next();
        });

        this._io.on('connection', socket => {
            const token: string = socket.handshake.auth.token;
            const authTokenBody = this._cryptManager.extractPayload<AuthTokenBody>(token);
            const player = new LobbyPlayer(authTokenBody.username, new PlayerConnection(socket));
            try {
                this._gameServer.playerManager.loginPlayer(player);
            } catch (e) {
                socket.disconnect();
                return;
            }

            // register all socket routes
            const packetListeners = new ServerClientPacketListeners(
                player,
                this._gameServer,
                this._configManager,
                this._cryptManager,
                this._log.createChildContext('Listeners'),
            );
            player.packetListeners = packetListeners;

            socket.on('disconnect', () => {
                this._gameServer.playerManager.logoffPlayer(authTokenBody.username);
            });
        });
    }

    async initialize() {
        this.startServer();
    }

    stop() {
        return new Promise<void>(res => {
            this._io.close(() => res());
        });
    }
}
