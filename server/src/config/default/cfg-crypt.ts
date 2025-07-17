import { Config } from '../config';
import assetPath from './crypt.json5' with { type: 'file' };

export class CfgCrypt extends Config {
	readonly NAME = 'crypt';
	readonly PATH = 'crypt.json5';
	readonly DEFAULT_PATH = assetPath;

	rsa_key_length!: number;
	rsa_algorithm!: string;
}
