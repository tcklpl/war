import { InvalidSecondAssignmentError } from '../../exceptions/generic/invalid_second_assignment_error';
import { ServerClientPacketListeners } from '../../socket/routes/server_client_packet_listeners';
import { PlayerConnection } from './player_connection';

export abstract class Player {
    private _packetListeners!: ServerClientPacketListeners;

    constructor(
        private readonly _username: string,
        private readonly _connection: PlayerConnection,
    ) {}

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
        if (this._packetListeners)
            throw new InvalidSecondAssignmentError(
                'Trying to assign a packet listener for a player that already has one',
            );
        this._packetListeners = pl;
    }
}
