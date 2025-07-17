import type { Logger } from '../../log/logger';
import { Command } from '../command';
import type { CommandExecutionData } from '../command-execution-data';

export class CommandStop extends Command {
	constructor(logger: Logger) {
		super('stop', 'Stop', [], 'Stops the server', logger);
	}

	execute(data: CommandExecutionData): boolean {
		data.server.stop();
		return true;
	}
}
