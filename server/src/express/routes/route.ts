import { Router } from "express";
import { ConfigManager } from "../../config/config_manager";

export abstract class ExpressRoute {

    readonly router = Router();
    constructor(protected _configManager: ConfigManager) {
        this.register();
    }

    abstract register(): void;
}