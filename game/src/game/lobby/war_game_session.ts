import { GamePauseReason, InitialGameStatePacket } from ':protocol';
import { ClientPacketGMoveOn } from '../server/connection/packet/to_send/ingame/move_on';
import { ClientPacketGPause } from '../server/connection/packet/to_send/ingame/pause';
import { ClientPacketPing } from '../server/connection/packet/to_send/ingame/ping';
import { ClientPacketGResume } from '../server/connection/packet/to_send/ingame/resume';
import { ClientPacketGSave } from '../server/connection/packet/to_send/ingame/save';
import { ClientPacketGSaveAndQuit } from '../server/connection/packet/to_send/ingame/save_and_quit';
import { ReconnectionInfo } from '../server/connection/reconnection_info';

export class WarGameSession {
    private _ping = 0;
    private readonly _pingTask = -1;

    private _token: string = '';

    private _pauseReason?: GamePauseReason;
    private _currentTurnPlayerIndex = 0;

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

    pauseGame() {
        new ClientPacketGPause().dispatch();
    }

    resumeGame() {
        new ClientPacketGResume().dispatch();
    }

    saveGame() {
        new ClientPacketGSave().dispatch();
    }

    pauseActionSaveAndQuit() {
        new ClientPacketGSaveAndQuit().dispatch();
    }

    pauseActionMoveOn() {
        new ClientPacketGMoveOn().dispatch();
    }

    notifyGamePaused(reason: GamePauseReason) {
        this._pauseReason = reason;
        game.state.reactState.useGameSession.setGPauseReason(reason);
        game.engine.pauseRender();
    }

    notifyGameResumed() {
        this._pauseReason = undefined;
        game.state.reactState.useGameSession.setGPauseReason(undefined);
        game.engine.resumeRender();
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

    get isPaused() {
        return !!this._pauseReason;
    }

    get pauseReason() {
        return this._pauseReason;
    }

    set token(token: string) {
        this._token = token;
        const reconnectionInfo = {
            serverIp: game.state.server?.connection.address,
            serverAuthToken: game.state.server?.connection.token,
            sessionToken: token,
        } as ReconnectionInfo;
        game.state.reactState.useGameSession.setReconnectionInfo(reconnectionInfo);
        console.log(reconnectionInfo);
    }
}
