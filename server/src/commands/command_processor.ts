import * as readLine from 'readline';
import { Logger } from '../log/logger';
import { WarServer } from '../war_server';
import { Command } from './command';
import { CommandConfig } from './default_commands/config';
import { CommandHelp } from './default_commands/help';
import { CommandStop } from './default_commands/stop';

export class CommandProcessor {
    private _commands: Command[] = [];

    private _commandInterface!: readLine.Interface;
    private _shouldParseNextCommand = true;

    constructor(
        private readonly _server: WarServer,
        private readonly _log: Logger,
    ) {
        this.registerCommands();
    }

    private registerCommands() {
        this._commands = [
            new CommandHelp(this._log.createChildContext('Help')),
            new CommandStop(this._log.createChildContext('Stop')),
            new CommandConfig(this._log.createChildContext('Config')),
        ];
    }

    stop() {
        this._shouldParseNextCommand = false;
        this._commandInterface.close();
    }

    parseCommands() {
        this._commandInterface = readLine.createInterface({ input: process.stdin });
        this.parseNextCommand();
    }

    parseNextCommand() {
        this._commandInterface.question('', command => {
            const commandParts = command.trim().split(' ');
            if (commandParts.length === 0) return;

            const executor = this._commands.find(
                x => x.command === commandParts[0] || x.aliases.find(a => a === commandParts[0]),
            );
            if (executor) {
                executor.executeRouted({
                    args: commandParts.slice(1),
                    server: this._server,
                });
            } else {
                this._log.info(`Unknown command "${commandParts[0]}"`);
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
