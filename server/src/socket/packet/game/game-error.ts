import type { GameError } from ':protocol';
import { ServerPacket } from '../server-packet';

export class ServerPacketGameError extends ServerPacket<'gGameError'> {
	constructor(err: GameError) {
		super('gGameError', err);
	}
}
