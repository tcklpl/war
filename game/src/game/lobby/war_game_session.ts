import { InitialGameStatePacket } from '../../../../protocol';
import { ClientPacketPing } from '../server/connection/packet/to_send/ingame/ping';

export class WarGameSession {
    private _currentTurnPlayerIndex = 0;

    private _ping = 0;
    private _pingTask = -1;

    private _token: string = '';

    constructor(public readonly initialGameState: InitialGameStatePacket) {
        this.measurePing();
        game.engine.resumeRender();
    }

    private measurePing() {
        const start = Date.now();
        new ClientPacketPing(() => {
            const duration = Date.now() - start;
            this.ping = duration;
        }).dispatch();
        window.setTimeout(() => this.measurePing(), 1000);
    }

    cleanup() {
        window.clearTimeout(this._pingTask);
    }

    get currentTurnPlayerIndex() {
        return this._currentTurnPlayerIndex;
    }

    set currentTurnPlayerIndex(i: number) {
        this._currentTurnPlayerIndex = i;
        game.state.reactState.useGameSession.setGTurnPlayerIndex(i);
    }

    get ping() {
        return this._ping;
    }

    private set ping(p: number) {
        this._ping = p;
    }

    get token() {
        return this._token;
    }

    set token(token: string) {
        this._token = token;
        game.state.reactState.useGameSession.setToken(token);
    }
}
