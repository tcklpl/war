import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const GameSaveSchema = sqliteTable('game_save', {
	id: text('id').primaryKey(),
	roomName: text('room_name').notNull(),
});
