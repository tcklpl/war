import { ClientToServerPackets, ServerToClientPackets, cl_LoginRequest, sv_LoginResponseOK, sv_ServerInfo } from "../../../../../protocol";
import { UnknownConnectionError } from "../../../errors/game/connection/unknown_connection_error";
import { UsernameNotAvailableError } from "../../../errors/game/connection/username_not_available";
import { WrongPasswordError } from "../../../errors/game/connection/wrong_password";
import { ServerListSelectInfo } from "../server_list_select_info";
import { Socket, io } from "socket.io-client";
import { ServerConnection } from "./server_connection";

type ServerConnectionCandidateStatus = 'loading' | 'pinging' | 'error' | 'ready' | 'connecting';

export class ServerConnectionCandidate {

    private TIMEOUT = 5; // timeout in seconds
    
    private _status: ServerConnectionCandidateStatus = 'loading';
    private _serverInfo?: sv_ServerInfo;

    private _pingAbortController?: AbortController;

    constructor(
        private _listInfo: ServerListSelectInfo
    ) {}
    
    /**
     * Tries to ping this server's remote address.
     * 
     * This function will return when either the server responds or the request times out.
     */
    async ping() {
        this.status = 'pinging';

        this._pingAbortController = new AbortController();
        setTimeout(() => this._pingAbortController?.abort(), this.TIMEOUT * 1000); // 20 sec timeout

        try {
            const result = await fetch(this._listInfo.address, { signal: this._pingAbortController.signal });

            // fetch doesn't throw an error for any valid response code, so we need to check if the response is ok
            if (!result.ok) {
                this.status = 'error';
                return;
            }

            // try to get the json response, if this fails we still end up on the catch statement below
            const responseBody = (await result.json()) as sv_ServerInfo;
            this._serverInfo = responseBody;
            this.status = 'ready';

        } catch (e) {
            this.status = 'error';
        }
    }

    cancelPing() {
        this._pingAbortController?.abort();
    }

    async connect(username: string, password?: string) {

        const loginResult = await fetch(`${this._listInfo.address}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            } as cl_LoginRequest)
        });
        
        if (!loginResult.ok) {

            if (loginResult.status === 403) throw new WrongPasswordError();
            if (loginResult.status === 409) throw new UsernameNotAvailableError();
            throw new UnknownConnectionError();

        }

        const response = await loginResult.json() as sv_LoginResponseOK;
        const socketURI = new URL(this._listInfo.address);
        socketURI.port = "36876";

        const socket: Socket<ServerToClientPackets, ClientToServerPackets> = io(socketURI.toString(), {
            auth: {
                token: response.token
            }
        });
        await this.waitForServerConnection(socket);
        
        const connection = new ServerConnection(socket, response.token);
        return connection;

    }

    private waitForServerConnection(socket: Socket) {
        return new Promise<void>((res, rej) => {

            socket.on("connect",() => {
                return res();
            });

            socket.on("connect_error", () => {
                return rej();
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

    get listInfo() {
        return this._listInfo;
    }
}