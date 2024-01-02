import * as fs from "fs";
import * as path from "path";
import { ConfigManager } from "../config/config_manager";
import { CfgCrypt } from "../config/default/cfg_crypt";
import { CryptoUtils } from "../utils/crypto_utils";
import svlog from "../utils/logging_utils";

export class CryptManager {

    constructor(private _configManager: ConfigManager) {}

    private _keyFolder = process.cwd();
    private _publicKeyFile = path.join(this._keyFolder, 'public.key');
    private _privateKeyFile = path.join(this._keyFolder, 'private.key');

    private _publicKey!: string;
    private _privateKey!: string;

    private checkIfKeyFilesExist() {
        return fs.existsSync(this._publicKeyFile) && fs.existsSync(this._privateKeyFile);
    }

    private loadKeys() {
        if (!this.checkIfKeyFilesExist()) {
            const cryptConfig = this._configManager.getConfig(CfgCrypt);

            svlog.log(`Crypt key files not found, generating new ones with length ${cryptConfig.rsa_key_length}`);
            const newKeys = CryptoUtils.generateRSAKeys(cryptConfig.rsa_key_length);

            fs.writeFileSync(this._publicKeyFile, newKeys.publicKey, { encoding: 'utf-8' });
            fs.writeFileSync(this._privateKeyFile, newKeys.privateKey, { encoding: 'utf-8' });

            this._publicKey = newKeys.publicKey;
            this._privateKey = newKeys.privateKey;
        } else {
            svlog.log(`Reading key files`);
            this._publicKey = fs.readFileSync(this._publicKeyFile, { encoding: 'utf-8' });
            this._privateKey = fs.readFileSync(this._privateKeyFile, { encoding: 'utf-8' });
        }
        svlog.log(`Keys are loaded`);
    }

    async initialize() {
        this.loadKeys();
    }

    get publicKey() {
        return this._publicKey;
    }

    get privateKey() {
        return this._privateKey;
    }

}