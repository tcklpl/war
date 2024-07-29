import { GameSessionConnectionInfo } from '../../../../../protocol';
import { LobbyMovedOnError } from '../../../exceptions/reconnection/lobby_moved_on_error';
import { PlayerAlreadyInLobbyError } from '../../../exceptions/reconnection/player_already_in_lobby_error';
import { PlayerDoesntBelongOnLobbyError } from '../../../exceptions/reconnection/player_doesnt_belong_on_lobby_error';
import { PacketListener } from '../packet_listener';

export class PLReconnectToGame extends PacketListener {
    register(): void {
        this._data.socket.on('gReconnectToGame', (token, result) => {
            // Validate the token
            if (!this._data.cryptManager.validateToken(token)) {
                this._data.logger.debug(
                    `${this._data.player.username} failed to rejoin lobby: invalid or expired token`,
                );
                return result({
                    result: 'error',
                    reason: 'invalid token',
                });
            }

            // Extract payload
            const payload = this._data.cryptManager.extractPayload<GameSessionConnectionInfo>(token);
            const game = this._data.gameServer.gameManager.getGameById(payload.game_id);
            if (!game) {
                this._data.logger.debug(
                    `${this._data.player.username} failed to rejoin lobby: game doesn't exist anymore`,
                );
                return result({
                    result: 'error',
                    reason: 'game does not exist',
                });
            }

            try {
                const newToken = game.reconnectPlayer(this._data.player);
                return result({
                    result: 'success',
                    new_token: newToken,
                });
            } catch (e) {
                if (e instanceof PlayerDoesntBelongOnLobbyError) {
                    this._data.logger.warn(
                        `${this._data.player.username} failed to rejoin lobby: player wasn't even on the lobby`,
                    );
                    return result({
                        result: 'error',
                        reason: 'player wasnt in lobby',
                    });
                }
                if (e instanceof PlayerAlreadyInLobbyError) {
                    this._data.logger.warn(
                        `${this._data.player.username} failed to rejoin lobby: player is still in the lobby`,
                    );
                    return result({
                        result: 'error',
                        reason: 'player still playing',
                    });
                }
                if (e instanceof LobbyMovedOnError) {
                    this._data.logger.debug(`${this._data.player.username} failed to rejoin lobby: the lobby moved on`);
                    return result({
                        result: 'error',
                        reason: 'game moved on',
                    });
                }
                this._data.logger.debug(`${this._data.player.username} failed to rejoin lobby: other error`);
                console.log(e);
                return result({
                    result: 'error',
                    reason: 'other',
                });
            }
        });
    }
}
