import { ConfigManager } from "../../config/config_manager";
import { ExpressRoute } from "./route";
import { RouteLogin } from "./route_login";
import { RouteServerInfo } from "./route_server_info";

export class ExpressRoutes {

    private _routes: ExpressRoute[];

    constructor(protected _configManager: ConfigManager) {
    }

    initialize() {
        this._routes = [
            new RouteServerInfo(this._configManager),
            new RouteLogin(this._configManager)
        ]
    }

    get routes() {
        return this._routes;
    }

}