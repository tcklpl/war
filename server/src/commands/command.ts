import { DuplicatedCommandError } from '../exceptions/duplicated_command_error';
import { Logger } from '../log/logger';
import { CommandExecutionData } from './command_execution_data';

export abstract class Command {
    private readonly _subroutes: Command[] = [];

    constructor(
        public readonly command: string,
        public readonly name: string,
        public readonly aliases: string[],
        public readonly description: string,
        protected readonly _log: Logger,
    ) {}

    abstract execute(data: CommandExecutionData): boolean;

    protected registerSubroute(subroute: Command) {
        if (
            this._subroutes.find(
                s => s.command === subroute.command || s.aliases.find(a => subroute.aliases.find(b => a === b)),
            )
        )
            throw new DuplicatedCommandError(
                `Trying to register a duplicated subroute "${subroute.command}" on command "${this.command}"`,
            );
        this._subroutes.push(subroute);
    }

    getRoutedExecutor(args: string[]): Command | undefined {
        if (args.length === 0) return this;
        const route = this._subroutes.find(r => r.command === args[0] || this.aliases.find(a => a === args[0]));
        if (route) return route.getRoutedExecutor(args.slice(1));
        return undefined;
    }

    executeRouted(data: CommandExecutionData) {
        const possibleSubroute =
            data.args.length > 0 ? this._subroutes.find(s => s.command === data.args[0]) : undefined;
        if (possibleSubroute) {
            data.args = data.args.slice(1);
            possibleSubroute.executeRouted(data);
        } else {
            this.execute(data);
        }
    }

    get subroutes() {
        return this._subroutes;
    }
}
