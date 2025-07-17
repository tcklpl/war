export interface ResponseServerInfoBody {
	name: string;
	description: string;
	hasPassword: boolean;
	socketPort: number;

	playerCount: number;
	playerLimit: number;
}
