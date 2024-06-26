import { GamePlayer } from '../../../game/player/game_player';
import { ServerPacket } from '../server_packet';

export class SvPktGPlayerReconnected extends ServerPacket<'gPlayerReconnected'> {
    constructor(player: GamePlayer) {
        super('gPlayerReconnected', player.username, !player.game.players.find(x => !x.online));
    }
}
