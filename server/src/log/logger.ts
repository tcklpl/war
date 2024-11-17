import { c } from 'tasai';
import { formatDate } from '../utils/date_utils';
import type { LoggerConfig } from './logger_config';

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
    private static _logTimeFormat = '%HH:%mm:%ss';

    private static readonly _logBuffer: string[] = [];
    private static _logBufferMaxSize = 2000;
    private static _logBufferIgnoreLogLevel = true;
    private static _crashLogFolder = `${process.cwd()}/crashlog`;
    private static _crashLogFileNameFormat = '%yyyy-%MM-%dd--%HH-%mm-%ss.crashlog.txt';

    private static readonly _privateLogger = new Logger('Logger');

    /**
     * Writes a crash log the the configured location with the current buffer.
     */
    static saveCrashLog(error: Error) {
        const moment = new Date();
        const fileName = `${this._crashLogFolder}/${formatDate(moment, this._crashLogFileNameFormat)}`;
        let logContent = this._logBuffer
            .join('\n')
            .replace(/[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''); // strip color

        // Print error that crashed the server
        logContent += '\n\n-----------------------------------------------------\n';
        logContent += `Error: ${error.name}\n`;
        logContent += `Message: ${error.message ?? '--'}\n`;
        logContent += `Cause: ${error.cause}\n`;
        logContent += 'Stacktrace:\n';
        logContent += error.stack;
        Bun.write(fileName, logContent, { createPath: true });
    }

    /**
     * Converts the log level string to the enum, defaulting to INFO.
     *
     * @param s Log Level string
     * @returns Log Level enum
     */
    private static parseLogLevelFromString(s: string) {
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
                this._privateLogger.warn(`Invalid log level '${s}', defaulting to INFO`);
                return LogLevel.INFO;
        }
    }

    /**
     * Configures the logger.
     *
     * @param cfg Logger configuration.
     */
    static configureLogger(cfg: LoggerConfig) {
        this._logLevel = this.parseLogLevelFromString(cfg.log_level);
        this._logTimeFormat = cfg.log_time_format;
        this._logBufferMaxSize = cfg.log_max_buffer_lines;
        this._crashLogFolder = `${process.cwd()}/${cfg.log_crashlog_folder}`;
        this._crashLogFileNameFormat = cfg.log_crashlog_file_name;
        this._logBufferIgnoreLogLevel = cfg.log_crashlog_ignore_log_level;
    }

    /**
     * Current context stack, for example ['War Server', 'Express Server']
     */
    private readonly _contextStack: string[] = [];

    constructor(...contextStack: string[]) {
        if (!!contextStack && contextStack.length > 0) {
            this._contextStack = contextStack;
        }
    }

    /**
     * Creates a new logger using the current context stack + the informed one.
     *
     * @param childNamespace Child namespace.
     * @returns Child logger.
     */
    createChildContext(childNamespace: string) {
        return new Logger(...this._contextStack, childNamespace);
    }

    private writeLogLineToBuffer(logLine: string) {
        Logger._logBuffer.push(logLine);
        if (Logger._logBuffer.length > Logger._logBufferMaxSize) Logger._logBuffer.shift();
    }

    private getCurrentTimeString() {
        const time = new Date();
        return c.dim(formatDate(time, Logger._logTimeFormat));
    }

    private getContextString() {
        return `${this._contextStack.map(ctx => c.yellow(ctx)).join(c.dim(' > '))} ${c.dim('>>>')}`;
    }

    private formatLogLine(severity: string, str: string) {
        return `[${this.getCurrentTimeString()}] [${severity}] ${this.getContextString()} ${str}`;
    }

    private printLogLine(level: LogLevel, severity: string, str: string) {
        if (Logger._logLevel < level && !Logger._logBufferIgnoreLogLevel) return;
        const line = this.formatLogLine(severity, str);
        this.writeLogLineToBuffer(line);
        if (Logger._logLevel >= level) console.log(line);
    }

    trace(str: string) {
        this.printLogLine(LogLevel.TRACE, c.dim('TRACE'), str);
    }

    debug(str: string) {
        this.printLogLine(LogLevel.DEBUG, c.dim('DEBUG'), str);
    }

    info(str: string) {
        this.printLogLine(LogLevel.INFO, c.brightBlue('INFO '), str);
    }

    warn(str: string) {
        this.printLogLine(LogLevel.WARN, c.yellow('WARN '), str);
    }

    error(str: string) {
        this.printLogLine(LogLevel.ERROR, c.brightRed('ERROR'), str);
    }

    fatal(str: string) {
        this.printLogLine(LogLevel.FATAL, c.red('FATAL'), str);
    }
}
