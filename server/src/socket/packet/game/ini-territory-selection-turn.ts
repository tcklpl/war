import { ServerPacket } from '../server-packet';

export class ServerPacketInitialTerritorySelectionTurn extends ServerPacket<'gInitialTerritorySelectionTurn'> {
	constructor(currentPlayer: string, timeout: number) {
		super('gInitialTerritorySelectionTurn', currentPlayer, timeout);
	}
}
