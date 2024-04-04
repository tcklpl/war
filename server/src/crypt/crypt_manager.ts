import * as fs from "fs";
import * as path from "path";
import * as jwt from "jsonwebtoken";
import { ConfigManager } from "../config/config_manager";
import { CfgCrypt } from "../config/default/cfg_crypt";
import { CryptoUtils } from "../utils/crypto_utils";
import svlog from "../utils/logging_utils";
import { AuthTokenBody } from "../../../protocol";
import { CfgServer } from "../config/default/cfg_server";

export class CryptManager {

    constructor(private _configManager: ConfigManager) {}

    private _keyFolder = process.cwd();
    private _publicKeyFile = path.join(this._keyFolder, 'public.key');
    private _privateKeyFile = path.join(this._keyFolder, 'private.key');

    private _publicKey!: string;
    private _privateKey!: string;
    private _algo!: 'RS256' | 'RS384' | 'RS512';
    private _signExpiration!: string;

    private checkIfKeyFilesExist() {
        return fs.existsSync(this._publicKeyFile) && fs.existsSync(this._privateKeyFile);
    }

    private loadKeys() {
        if (!this.checkIfKeyFilesExist()) {
            const cryptConfig = this._configManager.getConfig(CfgCrypt);

            svlog.info(`Crypt key files not found, generating new ones with length ${cryptConfig.rsa_key_length}`);
            const newKeys = CryptoUtils.generateRSAKeys(cryptConfig.rsa_key_length);

            fs.writeFileSync(this._publicKeyFile, newKeys.publicKey, { encoding: 'utf-8' });
            fs.writeFileSync(this._privateKeyFile, newKeys.privateKey, { encoding: 'utf-8' });

            this._publicKey = newKeys.publicKey;
            this._privateKey = newKeys.privateKey;
        } else {
            svlog.info(`Reading key files`);
            this._publicKey = fs.readFileSync(this._publicKeyFile, { encoding: 'utf-8' });
            this._privateKey = fs.readFileSync(this._privateKeyFile, { encoding: 'utf-8' });
        }
        svlog.info(`Keys are loaded`);
    }

    private validateAlgo() {
        const algo = this._configManager.getConfig(CfgCrypt).rsa_algorithm;
        const validAlgos = ['RS256', 'RS384', 'RS512'];
        if (!validAlgos.find(x => x === algo)) throw new Error(`Unknown crypt algo "${algo}", should be one of [${validAlgos.join(", ")}]`);
        this._algo = algo as 'RS256' | 'RS384' | 'RS512';

        const expiration = this._configManager.getConfig(CfgServer).client_auth_token_expiration;
        if (!/^[0-9]+h$/.test(expiration)) throw new Error(`Wrong token expiration format on "server.json5", should be on format [0-9]+h eg. 4h, 12h, 16h etc.`);
        this._signExpiration = expiration;
    }

    async initialize() {
        this.loadKeys();
        this.validateAlgo();
    }

    signTokenBody(tokenBody: AuthTokenBody) {
        return jwt.sign(tokenBody, this._privateKey, {
            algorithm: this._algo,
            expiresIn: this._signExpiration
        });
    }

    validateToken(token: string) {
        try {
            return !!jwt.verify(token, this._publicKey);
        } catch (e) {
            return false;
        }
    }

    extractPayload(token: string) {
        return jwt.decode(token) as AuthTokenBody;
    }

    get publicKey() {
        return this._publicKey;
    }

    get privateKey() {
        return this._privateKey;
    }

    get algorithm() {
        return this._algo;
    }

}