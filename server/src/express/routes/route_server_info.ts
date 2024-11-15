import { type ResponseServerInfoBody } from ':protocol';
import { CfgServer } from '../../config/default/cfg_server';
import { ExpressRoute } from './route';

export class RouteServerInfo extends ExpressRoute {
    register() {
        const serverConfig = this._configManager.getConfig(CfgServer);
        this.router.get('/', (req, res) => {
            res.status(200).json(<ResponseServerInfoBody>{
                name: serverConfig.name,
                hasPassword: serverConfig.password !== '',
                description: serverConfig.description,
                socketPort: serverConfig.socket_port,
                playerLimit: serverConfig.max_players,
                playerCount: this._gameServer.playerManager.loggedPlayers.length,
            });
        });
    }
}
