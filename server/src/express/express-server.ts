import cors from 'cors';
import express from 'express';
import type { Server } from 'http';
import type { ConfigManager } from '../config/config-manager';
import { CfgServer } from '../config/default/cfg-server';
import type { CryptManager } from '../crypt/crypt-manager';
import type { GameServer } from '../game/game-server';
import type { Logger } from '../log/logger';
import { ExpressRoutes } from './routes/routes';

export class ExpressServer {
	private _app!: express.Application;
	private _server!: Server;
	private readonly _routes!: ExpressRoutes;

	constructor(
		private readonly _configManager: ConfigManager,
		private readonly _cryptManager: CryptManager,
		private readonly _gameServer: GameServer,
		private readonly _log: Logger,
	) {
		this._routes = new ExpressRoutes(this._configManager, this._cryptManager, this._gameServer);
	}

	private startServer() {
		this._app = express();
		const serverConfig = this._configManager.getConfig(CfgServer);

		this._app.use(express.json());
		this._app.use(cors());
		this._routes.initialize();
		this._app.use(this._routes.routes.map(r => r.router));

		this._server = this._app.listen(serverConfig.rest_port);
		this._log.info(`REST Server listening on ${serverConfig.host}:${serverConfig.rest_port}`);
	}

	stop() {
		return new Promise<void>(res => {
			this._server.close(() => res());
		});
	}

	async initialize() {
		this.startServer();
	}
}
