import { ServerPacket } from '../server_packet';

export class ServerPacketInitialTerritorySelectionTurn extends ServerPacket<'gInitialTerritorySelectionTurn'> {
    constructor(currentPlayer: string, timeout: number) {
        super('gInitialTerritorySelectionTurn', currentPlayer, timeout);
    }
}
