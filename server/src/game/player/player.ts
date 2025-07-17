import { InvalidSecondAssignmentError } from '../../exceptions/generic/invalid-second-assignment-error';
import type { ServerClientPacketListeners } from '../../socket/routes/server-client-packet-listeners';
import type { PlayerConnection } from './player-connection';

export abstract class Player {
	private _packetListeners!: ServerClientPacketListeners;

	constructor(
		private readonly _username: string,
		private readonly _connection: PlayerConnection,
	) {}

	/**
	 * Updates all packet listeners to point to the target Player entity.
	 *
	 * @param target Target Player entity.
	 * @returns The target entity.
	 */
	morphInto(target: Player) {
		target.packetListeners = this._packetListeners;
		target.packetListeners.updatePlayerInstance(target);
		return target;
	}

	unregisterPacketListeners() {
		if (!this.packetListeners) return;
		this.packetListeners.unregisterPacketListeners();
	}

	get username() {
		return this._username;
	}

	get connection() {
		return this._connection;
	}

	get packetListeners() {
		return this._packetListeners;
	}

	set packetListeners(pl: ServerClientPacketListeners) {
		if (this._packetListeners?.active)
			throw new InvalidSecondAssignmentError(
				'Trying to assign a packet listener for a player that already has one',
			);
		this._packetListeners = pl;
	}
}
