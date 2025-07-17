import type { TokenBody } from './token-body';

export interface GameSessionConnectionInfo extends TokenBody {
	game_id: string;
	username: string;
}
