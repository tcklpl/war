import path = require("path");
import { Config } from "../config";
import { GameConfig } from "../../../../protocol";

export class CfgGame extends Config {

    readonly NAME = "game";
    readonly PATH = "game.json5";
    readonly DEFAULT_PATH = path.join(__dirname, "game.json5");

    game_start_countdown_seconds!: number;
    default_game_config!: GameConfig;

}