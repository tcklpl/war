import { Router } from "express";
import { ConfigManager } from "../../config/config_manager";
import { CryptManager } from "../../crypt/crypt_manager";

export abstract class ExpressRoute {

    readonly router = Router();
    constructor(protected _configManager: ConfigManager, protected _cryptManager: CryptManager) {
        this.register();
    }

    abstract register(): void;
}