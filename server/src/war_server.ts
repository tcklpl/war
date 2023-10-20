import { ConfigManager } from "./config/config_manager";
import { CryptManager } from "./crypt/crypt_manager";
import { ExpressServer } from "./express/express_server";
import svlog from "./utils/logging_utils";

export class WarServer {

    private _configManager = new ConfigManager();
    private _cryptManager = new CryptManager(this._configManager);

    private _expressServer = new ExpressServer(this._configManager);
    
    async initialize() {
        svlog.log(`Initializing server`);
        await this._configManager.loadConfig();
        await this._cryptManager.initialize();

        await this._expressServer.initialize();
    }

}