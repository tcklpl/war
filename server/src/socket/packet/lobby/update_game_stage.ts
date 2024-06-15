import { Game } from '../../../game/ingame/game';
import { ServerPacket } from '../server_packet';

export class ServerPacketUpdateGameStage extends ServerPacket<'gUpdateGameStage'> {
    constructor(game: Game) {
        super('gUpdateGameStage', game.stage);
    }
}
