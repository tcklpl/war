import { c } from 'tasai';

export enum LogLevel {
    FATAL = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4,
    TRACE = 5,
}

export class Logger {
    private static _logLevel = LogLevel.INFO;

    static parseLogLevelFromString(s: string) {
        switch (s.trim().toLowerCase()) {
            case 'fatal':
                return LogLevel.FATAL;
            case 'error':
                return LogLevel.ERROR;
            case 'warn':
                return LogLevel.WARN;
            case 'debug':
                return LogLevel.DEBUG;
            case 'trace':
                return LogLevel.TRACE;
            default:
                return LogLevel.INFO;
        }
    }

    static setLogLevel(l: LogLevel) {
        this._logLevel = l;
    }

    private readonly _contextStack: string[] = [];

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
        return c.dim(time.toTimeString().split(' ')[0]);
    }

    private getContextString() {
        return `${this._contextStack.map(ctx => c.yellow(ctx)).join(c.dim(' > '))} ${c.dim('>>>')}`;
    }

    private printLogLine(severity: string, str: string) {
        console.log(`[${this.getCurrentTimeString()}] [${severity}] ${this.getContextString()} ${str}`);
    }

    trace(str: string) {
        if (Logger._logLevel < LogLevel.TRACE) return;
        this.printLogLine(c.dim('TRACE'), str);
    }

    debug(str: string) {
        if (Logger._logLevel < LogLevel.DEBUG) return;
        this.printLogLine(c.dim('DEBUG'), str);
    }

    info(str: string) {
        if (Logger._logLevel < LogLevel.INFO) return;
        this.printLogLine(c.brightBlue('INFO '), str);
    }

    warn(str: string) {
        if (Logger._logLevel < LogLevel.WARN) return;
        this.printLogLine(c.yellow('WARN '), str);
    }

    error(str: string) {
        if (Logger._logLevel < LogLevel.ERROR) return;
        this.printLogLine(c.brightRed('ERROR'), str);
    }

    fatal(str: string) {
        if (Logger._logLevel < LogLevel.FATAL) return;
        this.printLogLine(c.red('FATAL'), str);
    }
}
