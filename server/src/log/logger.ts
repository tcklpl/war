import chalk from 'chalk';

export enum LogLevel {
    ERROR = 0,
    INFO = 1,
    WARN = 2,
    DEBUG = 3,
}

export class Logger {
    private static _logLevel = LogLevel.INFO;

    static parseLogLevelFromString(s: string) {
        switch (s.trim().toLowerCase()) {
            case 'debug':
                return LogLevel.DEBUG;
            case 'info':
                return LogLevel.INFO;
            case 'warn':
                return LogLevel.WARN;
            case 'error':
                return LogLevel.ERROR;
            default:
                return LogLevel.INFO;
        }
    }

    static setLogLevel(l: LogLevel) {
        this._logLevel = l;
    }

    private _contextStack: string[] = [];

    constructor(...contextStack: string[]) {
        if (!!contextStack && contextStack.length > 0) {
            this._contextStack = contextStack;
        }
    }

    createChildContext(childNamespace: string) {
        return new Logger(...this._contextStack, childNamespace);
    }

    private getCurrentTimeString() {
        const time = new Date();
        return chalk.gray(time.toTimeString().split(' ')[0]);
    }

    private getContextString() {
        return `${this._contextStack.map(c => chalk.yellow(c)).join(chalk.gray(' > '))} ${chalk.gray('>>>')}`;
    }

    debug(str: string) {
        if (Logger._logLevel < LogLevel.DEBUG) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.gray('DEBUG')}] ${this.getContextString()} ${str}`);
    }

    info(str: string) {
        if (Logger._logLevel < LogLevel.INFO) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.gray('INFO')}] ${this.getContextString()} ${str}`);
    }

    warn(str: string) {
        if (Logger._logLevel < LogLevel.WARN) return;
        console.log(`[${this.getCurrentTimeString()}] [${chalk.yellow('WARN')}] ${this.getContextString()} ${str}`);
    }

    err(str: string) {
        if (Logger._logLevel < LogLevel.ERROR) return;
        console.error(`[${this.getCurrentTimeString()}] [${chalk.red('ERROR')}] ${this.getContextString()} ${str}`);
    }
}
