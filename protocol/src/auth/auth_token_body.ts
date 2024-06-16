import { TokenBody } from './token_body';

export interface AuthTokenBody extends TokenBody {
    username: string;
    ip: string;
}
