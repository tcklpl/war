import * as fs from "fs";
import * as path from "path";
import { exit } from "process";
import { CfgServer } from "./default/cfg_server";
import { Config } from "./config";
import * as json5 from 'json5';
import { CfgCrypt } from "./default/cfg_crypt";
import { CfgGame } from "./default/cfg_game";
import { Logger } from "../log/logger";

export class ConfigManager {

    constructor(private _log: Logger) {}

    private _configFolder = path.join(process.cwd(), "config");
    private _configs = [
        new CfgServer(),
        new CfgCrypt(),
        new CfgGame()
    ];
    private _loadedConfigs: Map<(typeof Config)['name'], Config> = new Map(); 

    private checkPermissions() {
        try {
           fs.accessSync(__dirname, fs.constants.R_OK || fs.constants.W_OK);
           return true;
        } catch (err) {
            return false;
        }
    }

    private assertConfigFolder() {
        if (!fs.existsSync(this._configFolder)) {
            this._log.info(`Config folder doesn't exist, creating a new one`);
            fs.mkdirSync(this._configFolder);
        }
    }

    private assertConfigFiles() {
        this._configs.forEach(cfg => {
            if (!fs.existsSync(path.join(this._configFolder, cfg.PATH))) {
                this._log.info(`Config "${cfg.NAME}" doesn't exist, copying the default one`);
                
                if (!fs.existsSync(cfg.DEFAULT_PATH)) {
                    this._log.err(`Failed to load the default config "${cfg.NAME}" from "${cfg.DEFAULT_PATH}"`);
                    process.exit(1);
                }

                fs.copyFileSync(cfg.DEFAULT_PATH, path.join(this._configFolder, cfg.PATH));
            }
        });
    }

    private parseConfigFile(config: Config) {
        const cfgPath = path.join(this._configFolder, config.PATH);
        if (!fs.existsSync(cfgPath)) {
            this._log.err(`Failed to load file "${cfgPath}": File doesn't exist`);
            process.exit(1);
        }
        const fileContents = fs.readFileSync(cfgPath, { encoding: 'utf-8' });

        try {
            const parsed = json5.parse(fileContents);
            return parsed;
        } catch (err) {
            this._log.info(`Corrupted config "${config.NAME}" at "${cfgPath}", replacing it with the default one`);
            fs.copyFileSync(config.DEFAULT_PATH, path.join(this._configFolder, config.PATH));
            return this.parseConfigFile(config);
        }
    }

    private assertConfigCompletion() {
        this._configs.forEach(cfg => {
            const loadedCfg = this.parseConfigFile(cfg) as Config;

            const example = fs.readFileSync(cfg.DEFAULT_PATH, { encoding: 'utf-8' });
            const parsedExample = json5.parse(example);

            let incomplete = false;
            for (const exampleKey of Object.keys(parsedExample)) {
                if (!loadedCfg[exampleKey]) {
                    loadedCfg[exampleKey] = parsedExample[exampleKey];
                    incomplete = true;
                }
            }

            this._loadedConfigs.set(cfg.NAME, loadedCfg);
        });
    }
    
    async loadConfig() {
        this._log.info(`Loading configs`);
        if (!this.checkPermissions()) {
            this._log.err(`The server doesn't have permission to read or write to the current folder (${__dirname})`);
            exit(1);
        }
        this.assertConfigFolder();
        this.assertConfigFiles();
        this.assertConfigCompletion();
    }

    getConfig<T extends Config>(type: new () => T): T {
        const configType = new type();        
        return this._loadedConfigs.get(configType.NAME) as T;
    }
}