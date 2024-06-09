import { Logger } from "../../log/logger";
import { Command } from "../command";
import { CommandExecutionData } from "../command_execution_data";

export class CommandStop extends Command {

    constructor(logger: Logger) {
        super(
            "stop",
            "Stop",
            [],
            "Stops the server",
            logger
        );
    }

    execute(data: CommandExecutionData): boolean {
        data.server.stop();
        return true;
    }
    
}