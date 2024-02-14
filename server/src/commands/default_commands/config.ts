import svlog from "../../utils/logging_utils";
import { Command } from "../command";
import { CommandExecutionData } from "../command_execution_data";

export class CommandConfig extends Command {

    constructor() {
        super(
            "config",
            "Config",
            ["cfg"],
            "Commands about the server's configuration"
        );
        this.registerSubroute(new CommandConfigReload());
    }

    execute(data: CommandExecutionData): boolean {
        return false;
    }
    
}

class CommandConfigReload extends Command {

    constructor() {
        super(
            "reload",
            "Reload",
            [],
            "Reloads the config"
        );
    }

    execute(data: CommandExecutionData): boolean {
        svlog.log("Reloading config...");
        (async () => {
            await data.server.configManager.loadConfig();
            svlog.log("Config reloaded");
        })();
        return true;
    }

}