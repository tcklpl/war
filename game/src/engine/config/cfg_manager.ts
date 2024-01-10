import { IDBConnector } from "../idb/idb_connector";
import { IDBController } from "../idb/idb_controller";
import { ConfigDisplay } from "./cfg_display";
import { ConfigGame } from "./cfg_game";
import { ConfigGraphics } from "./cfg_graphics";
import { ConfigPage } from "./cfg_page";
import { ConfigSession } from "./cfg_session";

export class ConfigManager extends IDBController<ConfigPage> {
    
    graphics = new ConfigGraphics();
    display = new ConfigDisplay();
    game = new ConfigGame();
    session = new ConfigSession();

    constructor(con: IDBConnector) {
        super(con, {
            name: 'config',
            keyPath: 'page'
        });
    }

    async loadConfig() {
        this.graphics = this.assertLoadedConfigCompletion(this.graphics, await this.getOneAs<ConfigGraphics>(this.graphics.page));
        this.display = this.assertLoadedConfigCompletion(this.display, await this.getOneAs<ConfigDisplay>(this.display.page));
        this.game = this.assertLoadedConfigCompletion(this.game, await this.getOneAs<ConfigGame>(this.game.page));
        this.session = this.assertLoadedConfigCompletion(this.session, await this.getOneAs<ConfigSession>(this.session.page));
    }

    async saveConfig() {
        await this.put(this.graphics);
        await this.put(this.display);
        await this.put(this.game);
        await this.put(this.session);
    }

    /**
     * Asserts that the loaded config has all the fields present in the the reference one.
     * This prevents crashes when loading a config from an older version.
     * 
     * @param reference The default config values.
     * @param loadedConfig The loaded config to be checked.
     * @returns The config with all required fields. Returns the reference if the loaded config is null or undefined.
     */
    private assertLoadedConfigCompletion<T extends ConfigPage>(reference: T, loadedConfig?: T) {
        if (!loadedConfig) return reference;
        for (let refKey of Object.keys(reference)) {
            if (!Object.keys(loadedConfig).find(x => x === refKey)) {
                (loadedConfig as any)[refKey] = reference[refKey as keyof typeof reference];
            }
        }
        return loadedConfig;
    }

}