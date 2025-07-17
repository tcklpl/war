import type { AuthTokenBody } from ':protocol';
import { Server } from 'socket.io';
import type { GameSocketServer } from '../@types/server-socket';
import type { ConfigManager } from '../config/config-manager';
import { CfgServer } from '../config/default/cfg-server';
import type { CryptManager } from '../crypt/crypt-manager';
import type { GameServer } from '../game/game-server';
import { LobbyPlayer } from '../game/player/lobby-player';
import { PlayerConnection } from '../game/player/player-connection';
import type { Logger } from '../log/logger';
import { ServerClientPacketListeners } from './routes/server-client-packet-listeners';

export class SocketServer {
	constructor(
		private readonly _configManager: ConfigManager,
		private readonly _cryptManager: CryptManager,
		private readonly _gameServer: GameServer,
		private readonly _log: Logger,
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
			} catch {
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
