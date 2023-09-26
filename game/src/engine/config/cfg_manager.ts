import { IDBConnector } from "../idb/idb_connector";
import { IDBController } from "../idb/idb_controller";
import { ConfigDisplay } from "./cfg_display";
import { ConfigGame } from "./cfg_game";
import { ConfigGraphics } from "./cfg_graphics";
import { ConfigPage } from "./cfg_page";

export class ConfigManager extends IDBController<ConfigPage> {
    
    graphics = new ConfigGraphics();
    display = new ConfigDisplay();
    game = new ConfigGame();

    constructor(con: IDBConnector) {
        super(con, {
            name: 'config',
            keyPath: 'page'
        });
    }

    async loadConfig() {
        this.graphics = await this.getOneAs<ConfigGraphics>(this.graphics.page) ?? this.graphics;
        this.display = await this.getOneAs<ConfigDisplay>(this.display.page) ?? this.display;
        this.game = await this.getOneAs<ConfigGame>(this.game.page) ?? this.game;
    }

    async saveConfig() {
        this.put(this.graphics);
        this.put(this.display);
        this.put(this.game);
    }

}