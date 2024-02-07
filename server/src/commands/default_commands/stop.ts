import { Command } from "../command";
import { CommandExecutionData } from "../command_execution_data";

export class CommandStop extends Command {

    constructor() {
        super(
            "stop",
            "Stop",
            [],
            "Stops the server"
        );
    }

    execute(data: CommandExecutionData): boolean {
        data.server.stop();
        return true;
    }
    
}