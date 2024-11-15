import { Logger } from '../../log/logger';
import { Command } from '../command';
import { type CommandExecutionData } from '../command_execution_data';

export class CommandHelp extends Command {
    constructor(logger: Logger) {
        super('help', 'Help', ['h'], 'Shows help screen', logger);
    }

    execute(data: CommandExecutionData): boolean {
        if (data.args.length > 0) {
            const command = data.server.commandProcessor.getCommandByNameOrAlias(data.args[0]);
            if (!command) {
                this._log.info(`Failed to get help on unknown command "${data.args[0]}"`);
                return false;
            }
            const finalExecutor = command.getRoutedExecutor(data.args.slice(1));
            if (!finalExecutor) {
                this._log.info(`Failed to get subroute "${data.args[1]}" from command "${command.name}"`);
                return false;
            }
            console.table({
                name: finalExecutor.name,
                command: finalExecutor.command,
                aliases: finalExecutor.aliases.join(','),
                description: finalExecutor.description,
                subroutes: finalExecutor.subroutes.map(s => s.command).join(','),
            });
        } else {
            this._log.info(`Help Screen. To get info on a specific command, use "help <command name or alias>"`);
            const table = data.server.commandProcessor.commands.map(c => {
                return {
                    command: c.command,
                    aliases: c.aliases.join(',') ?? '--',
                    description: c.description,
                };
            });
            console.table(table);
        }
        return true;
    }
}
