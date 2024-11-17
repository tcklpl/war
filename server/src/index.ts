import { Logger } from './log/logger';
import { WarServer } from './war_server';

const log = new Logger('Boot');

process.on('uncaughtExceptionMonitor', e => {
    Logger.saveCrashLog(e);
    process.exit(1);
});

const server = new WarServer();
try {
    await server.initialize();
} catch (e) {
    log.fatal('Failed to initialize server');
    throw e;
}

// When the process is killed
process.on('SIGTERM', async () => {
    await server.stop();
});

// When the process is interrupted (^C)
process.on('SIGINT', async () => {
    await server.stop();
});

// Nodemon reload
process.on('SIGUSR2', async () => {
    await server.stop();
});
