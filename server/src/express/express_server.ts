import { ConfigManager } from "../config/config_manager";
import express from 'express';
import cors from 'cors';
import { CfgServer } from "../config/default/cfg_server";
import { ExpressRoutes } from "./routes/routes";
import { CryptManager } from "../crypt/crypt_manager";

export class ExpressServer {

    constructor (private _configManager: ConfigManager, private _cryptManager: CryptManager) {}
    
    private _app: express.Application;
    private _routes = new ExpressRoutes(this._configManager, this._cryptManager);

    private startServer() {
        this._app = express();
        const serverConfig = this._configManager.getConfig(CfgServer);
        
        this._app.use(express.json());
        this._app.use(cors());
        this._routes.initialize();
        this._app.use(this._routes.routes.map(r => r.router));

        this._app.listen(serverConfig.port);
    }

    async initialize() {
        this.startServer();
    }
}