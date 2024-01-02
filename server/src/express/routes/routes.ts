import { ConfigManager } from "../../config/config_manager";
import { CryptManager } from "../../crypt/crypt_manager";
import { ExpressRoute } from "./route";
import { RouteLogin } from "./route_login";
import { RouteServerInfo } from "./route_server_info";

export class ExpressRoutes {

    private _routes: ExpressRoute[];

    constructor(protected _configManager: ConfigManager, private _cryptManager: CryptManager) {
    }

    initialize() {
        this._routes = [
            new RouteServerInfo(this._configManager, this._cryptManager),
            new RouteLogin(this._configManager, this._cryptManager)
        ]
    }

    get routes() {
        return this._routes;
    }

}