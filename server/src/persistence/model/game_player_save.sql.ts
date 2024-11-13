import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GameSaveSchema } from './game_save.sql';

export const GamePlayerSaveSchema = sqliteTable('game_player_save', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username', { length: 50 }).notNull(),
    owner: integer('owner', { mode: 'boolean' }).notNull(),
    party: text('party', { length: 50 }).notNull(),
    game: text('game')
        .references(() => GameSaveSchema.id)
        .notNull(),
});
