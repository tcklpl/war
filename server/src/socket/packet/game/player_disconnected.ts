import { GamePlayer } from '../../../game/player/game_player';
import { ServerPacket } from '../server_packet';

export class SvPktGPlayerDisconnected extends ServerPacket<'gPlayerDisconnected'> {
    constructor(player: GamePlayer) {
        super('gPlayerDisconnected', player.username);
    }
}
