import type { ConfigManager } from '../../config/config-manager';
import type { CryptManager } from '../../crypt/crypt-manager';
import type { GameServer } from '../../game/game-server';
import type { ExpressRoute } from './route';
import { RouteLogin } from './route-login';
import { RouteServerInfo } from './route-server-info';

export class ExpressRoutes {
	private _routes!: ExpressRoute[];

	constructor(
		protected _configManager: ConfigManager,
		protected _cryptManager: CryptManager,
		protected _gameServer: GameServer,
	) {}

	initialize() {
		this._routes = [
			new RouteServerInfo(this._configManager, this._cryptManager, this._gameServer),
			new RouteLogin(this._configManager, this._cryptManager, this._gameServer),
		];
	}

	get routes() {
		return this._routes;
	}
}
