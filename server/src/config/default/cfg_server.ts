import path = require("path");
import { Config } from "../config";

export class CfgServer extends Config {

    readonly NAME = "server";
    readonly PATH = "server.json5";
    readonly DEFAULT_PATH = path.join(__dirname, "server.json5");

    host!: string;
    rest_port!: number;
    socket_port!: number;
    log_level!: "debug" | "info" | "warn" | "error";

    name!: string;
    password!: string;
    description!: string;

    max_players!: number;
    max_lobbies!: number;

    client_auth_token_expiration!: string;

}