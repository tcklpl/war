import { WarServer } from './war_server';
import 'reflect-metadata';

const server = new WarServer();
server.initialize();

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
