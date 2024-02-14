import svlog from "../utils/logging_utils";
import { WarServer } from "../war_server";
import { Command } from "./command";
import { CommandConfig } from "./default_commands/config";
import { CommandHelp } from "./default_commands/help";
import { CommandStop } from "./default_commands/stop";
import * as readLine from "readline";

export class CommandProcessor {

    private _commands: Command[] = [
        new CommandHelp(),
        new CommandStop(),
        new CommandConfig()
    ];

    private _commandInterface!: readLine.Interface;
    private _shouldParseNextCommand = true;

    constructor(private _server: WarServer) {}

    stop() {
        this._shouldParseNextCommand = false;
        this._commandInterface.close();
    }

    parseCommands() {
        this._commandInterface = readLine.createInterface({ input: process.stdin });
        this.parseNextCommand();
    }

    parseNextCommand() {
        this._commandInterface.question("", command => {
            const commandParts = command.trim().split(" ");
            if (commandParts.length === 0) return;

            const executor = this._commands.find(x => x.command === commandParts[0] || x.aliases.find(a => a === commandParts[0]));
            if (executor) {
                executor.executeRouted({
                    args: commandParts.slice(1),
                    server: this._server
                });
            } else {
                svlog.log(`Unknown command "${commandParts[0]}"`);
            }
            if (this._shouldParseNextCommand) this.parseNextCommand();
        });
    }

    getCommandByNameOrAlias(query: string) {
        return this._commands.find(c => c.command === query || c.aliases.find(a => a === query));
    }

    get commands() {
        return this._commands;
    }

}