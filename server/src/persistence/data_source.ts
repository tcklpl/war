import { DataSource } from 'typeorm';

export const ServerDataSource = new DataSource({
    type: 'sqlite',
    database: process.cwd() + '/gamedata.db',
});
