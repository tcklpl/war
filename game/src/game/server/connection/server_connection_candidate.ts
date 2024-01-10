import { sv_ServerInfo } from "../../../../../protocol";
import { ServerListSelectInfo } from "../server_list_select_info";

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

    async connect(password?: string) {
        
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