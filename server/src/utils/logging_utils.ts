import chalk from "chalk";

export enum LogLevel {
    ERROR = 0,
    INFO  = 1,
    WARN  = 2,
    DEBUG = 3,
}

export default class svlog {

    private static _logLevel = LogLevel.INFO;

    private static getCurrentTimeString() {
        const time = new Date();
        return chalk.gray(time.toTimeString().split(' ')[0]);
    }

    static parseLogLevelFromString(s: string) {
        switch (s.trim().toLowerCase()) {
            case "debug":
                return LogLevel.DEBUG;
            case "info":
                return LogLevel.INFO;
            case "warn":
                return LogLevel.WARN;
            case "error":
                return LogLevel.ERROR;
            default:
                return LogLevel.INFO;
        }
    }

    static setLogLevel(l: LogLevel) {
        this._logLevel = l;
    }

    static debug(str: string) {
        if (this._logLevel < LogLevel.DEBUG) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.gray("DEBUG")}] ${str}`);
    }

    static info(str: string) {
        if (this._logLevel < LogLevel.INFO) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.gray("INFO")}] ${str}`);
    }

    static warn(str: string) {
        if (this._logLevel < LogLevel.WARN) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.yellow("WARN")}] ${str}`);
    }

    static err(str: string) {
        if (this._logLevel < LogLevel.ERROR) return;
        console.error(`[${this.getCurrentTimeString()}] [${chalk.red("ERROR")}] ${str}`);
    }
}
