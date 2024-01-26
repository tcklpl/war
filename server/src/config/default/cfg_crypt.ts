import path = require("path");
import { Config } from "../config";

export class CfgCrypt extends Config {

    readonly NAME = "crypt";
    readonly PATH = "crypt.json5";
    readonly DEFAULT_PATH = path.join(__dirname, "crypt.json5");

    rsa_key_length!: number;
    rsa_algorithm!: string;

}