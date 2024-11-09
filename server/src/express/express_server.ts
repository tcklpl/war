import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import { ConfigManager } from '../config/config_manager';
import { CfgServer } from '../config/default/cfg_server';
import { CryptManager } from '../crypt/crypt_manager';
import { GameServer } from '../game/game_server';
import { Logger } from '../log/logger';
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
