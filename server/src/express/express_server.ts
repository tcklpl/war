import { ConfigManager } from "../config/config_manager";
import express from 'express';
import { CfgServer } from "../config/default/cfg_server";
import { ExpressRoutes } from "./routes/routes";

export class ExpressServer {

    constructor (private _configManager: ConfigManager) {}
    
    private _app: express.Application;
    private _routes = new ExpressRoutes(this._configManager);

    private startServer() {
        this._app = express();
        const serverConfig = this._configManager.getConfig(CfgServer);
        
        this._app.use(express.json());
        this._routes.initialize();
        this._app.use(this._routes.routes.map(r => r.router));

        this._app.listen(serverConfig.port);
    }

    async initialize() {
        this.startServer();
    }
}