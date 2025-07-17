import type { LobbyListState, LobbyListStateLobby } from ':protocol';
import type { CfgServer } from '../../../config/default/cfg-server';
import type { LobbyManager } from '../../../game/lobby/lobby-manager';
import { ServerPacket } from '../server-packet';

export class ServerPacketLobbies extends ServerPacket<'lobbies'> {
	constructor(gameRoomManager: LobbyManager, serverCfg: CfgServer) {
		const lobbies: LobbyListState = {
			max_lobbies: serverCfg.max_lobbies,
			lobbies: gameRoomManager.lobbies.map(
				room =>
					<LobbyListStateLobby>{
						name: room.name,
						owner_name: room.owner.username,
						player_count: room.players.length,
						joinable: room.joinable,
					},
			),
		};
		super('lobbies', lobbies);
	}
}
