import path = require("path");
import { Config } from "../config";

export class CfgServer extends Config {

    readonly NAME = "server";
    readonly PATH = "server.json5";
    readonly DEFAULT_PATH = path.join(__dirname, "server.json5");

    host: string;
    port: number;

    name: string;
    password: string;

}