import { Config } from '../config';
import assetPath from './server.json5' with { type: 'file' };

export class CfgServer extends Config {
    readonly NAME = 'server';
    readonly PATH = 'server.json5';
    readonly DEFAULT_PATH = assetPath;

    host!: string;
    rest_port!: number;
    socket_port!: number;
    log_level!: 'debug' | 'info' | 'warn' | 'error';

    name!: string;
    password!: string;
    description!: string;

    max_players!: number;
    max_lobbies!: number;

    client_auth_token_expiration!: string;
}
