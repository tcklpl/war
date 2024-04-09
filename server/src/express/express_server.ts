import { ConfigManager } from "../config/config_manager";
import express from 'express';
import cors from 'cors';
import { CfgServer } from "../config/default/cfg_server";
import { ExpressRoutes } from "./routes/routes";
import { CryptManager } from "../crypt/crypt_manager";
import { GameServer } from "../game/game_server";
import { Server } from "http";
import { Logger } from "../log/logger";

export class ExpressServer {

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager, private _gameServer: GameServer, private _log: Logger) {}
    
    private _app!: express.Application;
    private _server!: Server;
    private _routes = new ExpressRoutes(this._configManager, this._cryptManager, this._gameServer);

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
        return new Promise<void>((res) => {
            this._server.close(() => res());
        });
    }

    async initialize() {
        this.startServer();
    }
}