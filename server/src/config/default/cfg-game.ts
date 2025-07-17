import type { GameConfig } from ':protocol';
import { Config } from '../config';
import assetPath from './game.json5' with { type: 'file' };

export class CfgGame extends Config {
	readonly NAME = 'game';
	readonly PATH = 'game.json5';
	readonly DEFAULT_PATH = assetPath;

	game_start_countdown_seconds!: number;
	default_game_config!: GameConfig;
}
