import type { TokenBody } from './token-body';

export interface AuthTokenBody extends TokenBody {
	username: string;
	ip: string;
}
