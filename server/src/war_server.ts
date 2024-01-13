import { ConfigManager } from "./config/config_manager";
import { CryptManager } from "./crypt/crypt_manager";
import { ExpressServer } from "./express/express_server";
import { GameServer } from "./game/game_server";
import { SocketServer } from "./socket/socket_server";
import svlog from "./utils/logging_utils";

export class WarServer {

    private _configManager = new ConfigManager();
    private _cryptManager = new CryptManager(this._configManager);

    private _gameServer = new GameServer(this._configManager, this._cryptManager);
    private _expressServer = new ExpressServer(this._configManager, this._cryptManager, this._gameServer);
    private _socketServer = new SocketServer(this._configManager, this._cryptManager, this._gameServer);
    
    async initialize() {
        const startTime = Date.now();
        svlog.log(`Initializing server`);
        await this._configManager.loadConfig();
        await this._cryptManager.initialize();

        await this._gameServer.initialize();
        await this._expressServer.initialize();
        await this._socketServer.initialize();
        const loadTime = Date.now() - startTime;
        svlog.log(`Server started successfully in ${loadTime}ms`);
    }

}