import { sv_ServerInfo } from "../../../../protocol";
import { CfgServer } from "../../config/default/cfg_server";
import { ExpressRoute } from "./route";

export class RouteServerInfo extends ExpressRoute {

    register() {
        const serverConfig = this._configManager.getConfig(CfgServer);
        this.router.get('/', (req, res) => {
            res.status(200).json(<sv_ServerInfo> {
                name: serverConfig.name,
                hasPassword: serverConfig.password !== "",
                description: serverConfig.description,
                playerLimit: serverConfig.max_players,
                playerCount: this._gameServer.loggedPlayers.length
            });
        });
    }
}