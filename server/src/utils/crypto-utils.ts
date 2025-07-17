import { generateKeyPairSync } from 'crypto';

export class CryptoUtils {
	static generateRSAKeys(length: number) {
		return generateKeyPairSync('rsa', {
			modulusLength: length,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem',
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
			},
		});
	}
}
