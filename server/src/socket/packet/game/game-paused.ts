import type { GamePauseReason } from ':protocol';
import { ServerPacket } from '../server-packet';

export class SvPktGGamePaused extends ServerPacket<'gGamePaused'> {
	constructor(reason: GamePauseReason) {
		super('gGamePaused', reason);
	}
}
