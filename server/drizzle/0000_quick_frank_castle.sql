CREATE TABLE `game_player_save` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(50) NOT NULL,
	`owner` integer NOT NULL,
	`party` text(50) NOT NULL,
	`game` text NOT NULL,
	FOREIGN KEY (`game`) REFERENCES `game_save`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_save` (
	`id` text PRIMARY KEY NOT NULL,
	`room_name` text NOT NULL
);
