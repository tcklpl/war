import { Socket, io } from 'socket.io-client';
import {
    ClientToServerPackets,
    ResponseServerInfoBody,
    ServerToClientPackets,
    cl_LoginRequest,
    sv_LoginResponseOK,
} from '../../../../../protocol';
import { UnknownConnectionError } from '../../../errors/game/connection/unknown_connection_error';
import { UsernameNotAvailableError } from '../../../errors/game/connection/username_not_available';
import { WrongPasswordError } from '../../../errors/game/connection/wrong_password';
import { ServerConnection } from './server_connection';

type ServerConnectionCandidateStatus = 'loading' | 'pinging' | 'error' | 'ready' | 'connecting';

export class ServerConnectionCandidate {
    private readonly TIMEOUT = 5; // timeout in seconds

    private _status: ServerConnectionCandidateStatus = 'loading';
    private _serverInfo?: ResponseServerInfoBody;

    private _pingAbortController?: AbortController;

    constructor(private readonly _address: string) {}

    /**
     * Tries to ping this server's remote address.
     *
     * This function will return when either the server responds or the request times out.
     */
    async ping() {
        this.status = 'pinging';

        this._pingAbortController = new AbortController();
        window.setTimeout(() => this._pingAbortController?.abort(), this.TIMEOUT * 1000); // 20 sec timeout

        try {
            const result = await fetch(this._address, { signal: this._pingAbortController.signal });

            // fetch doesn't throw an error for any valid response code, so we need to check if the response is ok
            if (!result.ok) {
                this.status = 'error';
                return;
            }

            // try to get the json response, if this fails we still end up on the catch statement below
            const responseBody = (await result.json()) as ResponseServerInfoBody;
            this._serverInfo = responseBody;
            this.status = 'ready';
        } catch (e) {
            this.status = 'error';
        }
    }

    cancelPing() {
        this._pingAbortController?.abort();
    }

    async login(username: string, password?: string) {
        if (!this._serverInfo) {
            console.warn('Trying to connect to a server we have no info');
            return;
        }

        const loginResult = await fetch(`${this._address}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            } as cl_LoginRequest),
        });

        if (!loginResult.ok) {
            if (loginResult.status === 403) throw new WrongPasswordError();
            if (loginResult.status === 409) throw new UsernameNotAvailableError();
            throw new UnknownConnectionError();
        }

        const response = (await loginResult.json()) as sv_LoginResponseOK;
        return await this.connect(response.token);
    }

    async connect(token: string) {
        if (!this._serverInfo) {
            console.warn('Trying to connect to a server we have no info');
            return;
        }

        const socketURI = new URL(this._address);
        socketURI.port = this._serverInfo.socketPort.toString();

        const socket: Socket<ServerToClientPackets, ClientToServerPackets> = io(socketURI.toString(), {
            auth: {
                token,
            },
        });
        try {
            await this.waitForServerConnection(socket);
        } catch (_) {
            return;
        }

        const connection = new ServerConnection(this._address, socket, token);
        return connection;
    }

    private waitForServerConnection(socket: Socket) {
        return new Promise<void>((res, rej) => {
            socket.on('connect', () => {
                return res();
            });

            socket.on('connect_error', () => {
                return rej(new Error('Failed to connect to server'));
            });
        });
    }

    get status() {
        return this._status;
    }

    private set status(s: ServerConnectionCandidateStatus) {
        this._status = s;
    }

    get serverInfo() {
        return this._serverInfo;
    }

    get address() {
        return this._address;
    }
}
