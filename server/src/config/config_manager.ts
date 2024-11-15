import { file } from 'bun';
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import { Logger } from '../log/logger';
import { Config } from './config';
import { CfgCrypt } from './default/cfg_crypt';
import { CfgGame } from './default/cfg_game';
import { CfgServer } from './default/cfg_server';
const JSON5 = require('json5');

export class ConfigManager {
    constructor(private readonly _log: Logger) {}

    private readonly _configFolder = path.join(process.cwd(), 'config');
    private readonly _configs = [new CfgServer(), new CfgCrypt(), new CfgGame()];
    private readonly _loadedConfigs: Map<(typeof Config)['name'], Config> = new Map();

    private checkPermissions() {
        try {
            fs.accessSync(process.cwd(), fs.constants.R_OK || fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    private assertConfigFolder() {
        if (!fs.existsSync(this._configFolder)) {
            this._log.info(`Config folder doesn't exist, creating a new one`);
            fs.mkdirSync(this._configFolder);
        }
    }

    private async assertConfigFiles() {
        for (const cfg of this._configs) {
            if (fs.existsSync(path.join(this._configFolder, cfg.PATH))) continue;

            this._log.info(`Config "${cfg.NAME}" doesn't exist, copying the default one`);

            const modelConfigFile = file(cfg.DEFAULT_PATH);
            const fileExists = await modelConfigFile.exists();
            if (!fileExists) {
                this._log.fatal(`Failed to load the default config "${cfg.NAME}" from "${cfg.DEFAULT_PATH}"`);
                process.exit(1);
            }

            await Bun.write(path.join(this._configFolder, cfg.PATH), modelConfigFile);
        }
    }

    private async parseConfigFile(config: Config) {
        const cfgPath = path.join(this._configFolder, config.PATH);
        if (!fs.existsSync(cfgPath)) {
            this._log.fatal(`Failed to load file "${cfgPath}": File doesn't exist`);
            process.exit(1);
        }
        const fileContents = fs.readFileSync(cfgPath, { encoding: 'utf-8' });

        const modelConfigFile = file(config.DEFAULT_PATH);
        const fileExists = await modelConfigFile.exists();

        if (!fileExists) {
            this._log.fatal(`Default config path "${config.DEFAULT_PATH}" doesn't exist for config "${config.NAME}"`);
            process.exit(1);
        }

        try {
            const parsed = JSON5.parse(fileContents);
            return parsed;
        } catch {
            this._log.warn(`Corrupted config "${config.NAME}" at "${cfgPath}", replacing it with the default one`);
            await Bun.write(path.join(this._configFolder, config.PATH), modelConfigFile);
            return this.parseConfigFile(config);
        }
    }

    private async assertConfigCompletion() {
        for (const cfg of this._configs) {
            const loadedCfg = (await this.parseConfigFile(cfg)) as Config;

            const example = fs.readFileSync(cfg.DEFAULT_PATH, { encoding: 'utf-8' });
            const parsedExample = JSON5.parse(example);

            for (const exampleKey of Object.keys(parsedExample)) {
                if (!loadedCfg[exampleKey]) {
                    loadedCfg[exampleKey] = parsedExample[exampleKey];
                }
            }

            this._loadedConfigs.set(cfg.NAME, loadedCfg);
        }
    }

    async loadConfig() {
        this._log.info(`Loading configs`);
        if (!this.checkPermissions()) {
            this._log.fatal(
                `The server doesn't have permission to read or write to the current folder (${process.cwd()})`,
            );
            exit(1);
        }
        this.assertConfigFolder();
        await this.assertConfigFiles();
        await this.assertConfigCompletion();
        this._log.info(`Configs loaded`);
    }

    getConfig<T extends Config>(type: new () => T): T {
        const configType = new type();
        return this._loadedConfigs.get(configType.NAME) as T;
    }
}
