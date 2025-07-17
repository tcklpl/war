import type { WarServer } from '../war-server';

export interface CommandExecutionData {
	args: string[];
	server: WarServer;
}
