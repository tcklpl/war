import { Router } from 'express';
import type { ConfigManager } from '../../config/config-manager';
import type { CryptManager } from '../../crypt/crypt-manager';
import type { GameServer } from '../../game/game-server';

export abstract class ExpressRoute {
	readonly router = Router();
	constructor(
		protected _configManager: ConfigManager,
		protected _cryptManager: CryptManager,
		protected _gameServer: GameServer,
	) {
		this.register();
	}

	abstract register(): void;
}
