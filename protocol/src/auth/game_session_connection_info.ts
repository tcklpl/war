import { TokenBody } from './token_body';

export interface GameSessionConnectionInfo extends TokenBody {
    game_id: string;
    username: string;
}
